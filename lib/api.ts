// @ts-ignore
// deno-lint-ignore-file

// ignore TS2580
declare var require: any;

export const VERSION = "v1";
export const DEFAULT_BASE_URL = "https://dev.rightech.io/";

export type DeprecatedResponseV1 = {
  codes: string[];
  success: boolean;
};

export type DeprecatedResponseV2 = {};
export type DeprecatedResponse = DeprecatedResponseV1 & DeprecatedResponseV2;

export type ApiErrorHelper = {
  message: string;
  links?: string[];
};

export type RequestOptions<T = unknown> = {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: T;
};

function unique<T = unknown>(array: T[] = []) {
  return array.filter((item, pos, self) => {
    return self.indexOf(item) === pos;
  });
}

export interface ApiError extends Error {
  url: string;
  code: number;
  tags: string[];
  helper: ApiErrorHelper;
}

export class ApiError extends Error implements ApiError {
  url: string = "";
  verb: string = "GET";
  tags: string[] = [];
  code = 500;
  helper = {} as ApiErrorHelper;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error["captureStackTrace"] === "function") {
      Error["captureStackTrace"](this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  withTags(tags: string[] = []) {
    this.tags = unique([...this.tags, ...(tags || [])]);
    if (this.tags.length) {
      this.message = `${this.message} with tags [${this.tags}]`;
    }
    return this;
  }

  withHelper(helper: ApiErrorHelper) {
    this.helper = { ...this.helper, ...(helper || {}) };
    if (this.helper && this.helper.message) {
      this.message = `${this.message}. ${this.helper.message}`;
    }
    return this;
  }

  withVerb(verb = "GET") {
    this.verb = verb;
    return this;
  }

  withCode(code: number) {
    this.code = +code;
    this.message = `${this.code}: ${this.message}`;
    return this;
  }

  withUrl(url: string) {
    this.url = url;
    this.message = `${this.message} for ${this.verb.toUpperCase()} ${this.url}`;
    return this;
  }

  static fromJson(opts: RequestOptions, json: ApiError, statusCode = 500) {
    return new ApiError(json.message)
      .withCode(statusCode)
      .withHelper(json.helper)
      .withVerb(opts.method)
      .withUrl(opts.url)
      .withTags(json.tags);
  }
}

export class NginxError extends ApiError {
  static fromHtml(opts: RequestOptions, resp = "", statusCode = 500) {
    let [, title = "Unknown nginx errror"] =
      /<title>(.*?)<\/title>/gi.exec(resp) || [];
    title = title.replace(statusCode.toString(), "").trim();

    return new NginxError(title)
      .withCode(statusCode)
      .withVerb(opts.method)
      .withUrl(opts.url);
  }
}

export function nodeReq<Q = unknown, S = unknown>(
  opts: RequestOptions<Q>,
  { returnStream }: { returnStream?: boolean } = {}
): Promise<S> {
  const { protocol, hostname, port, pathname, search } = new URL(opts.url);

  const proto = protocol === "https:" ? require("https") : require("http");

  const options = {
    method: "GET",
    host: hostname,
    port: +port,
    path: `${pathname}${search}`,
    ...opts,
  };

  if (!port) {
    options.port = protocol === "https:" ? 443 : 80;
  }

  return new Promise((resolve, reject) => {
    const req = proto.request(
      options,
      (res: EventEmitter0 & { statusCode: number }) => {
        if (returnStream) {
          resolve(res as any);
          return;
        }
        let resp = "";
        res.on("data", (chunk: string) => (resp += chunk.toString()));
        res.on("end", () => {
          try {
            /*
             * most nginx upstream errors should be handled by ingress default-backend
             * but who knows ...
             */
            if (resp.startsWith("<html>") && resp.includes("nginx")) {
              return reject(NginxError.fromHtml(opts, resp, res.statusCode));
            }
            const json = JSON.parse(resp);
            if (res.statusCode >= 400) {
              return reject(ApiError.fromJson(opts, json, res.statusCode));
            }
            resolve(json);
          } catch (err) {
            console.log(resp);
            reject(err);
          }
        });
      }
    );

    req.on("error", (err: unknown) => reject(err));

    if (opts.body) {
      let send = opts.body as any;
      if (typeof send === "object") {
        send = JSON.stringify(opts.body);
      }
      req.write(send);
    }
    req.end();
  });
}

function tryGetFetch(): (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response> {
  return (globalThis as any)["fetch"] as any;
}

class EventEmitter0 {
  registry: Record<string, Function[]> = {};

  on<T>(event: string, handler: (data: T) => void) {
    if (!this.registry[event]) {
      this.registry[event] = [];
    }
    this.registry[event].push(handler);
    return handler;
  }
  emit<T>(event: string, data?: T) {
    if (!this.registry[event]) {
      this.registry[event] = [];
    }
    this.registry[event].forEach((handler) => handler(data));
  }
}

function read(response: ReadableStream<Uint8Array>) {
  let cancellationToken: { cancel: () => void };
  let cancellationRequest = false;

  const deno = (globalThis as any)["Deno"] as any;
  let streamOptions = { stream: true } as any;
  if (deno) {
    streamOptions = {};
  }

  const events = new EventEmitter0();
  const stream = new ReadableStream({
    start(controller) {
      const reader = response.getReader();
      cancellationToken = reader;

      const decoder = new TextDecoder();
      let buf = "";
      let totalBytes = 0;

      reader
        .read()
        .then(function processResult(result): any {
          if (result.done) {
            if (cancellationRequest) {
              return;
            }

            buf = buf.trim();
            if (buf.length !== 0) {
              try {
                controller.enqueue(JSON.parse(buf));
              } catch (e) {
                controller.error(e);
                return;
              }
            }
            controller.close();
            return;
          }

          const data = decoder.decode(result.value, streamOptions);
          buf += data;
          totalBytes += buf.length;

          const stats = { bytes: buf.length, totalBytes };
          const lines = buf.split("\n");
          let batch = [];
          let l = "";

          for (let i = 0; i < lines.length - 1; ++i) {
            l = lines[i].trim();
            if (l === "[") {
              events.emit("start");
              continue;
            }
            if (l === ",") {
              continue;
            }

            if (l.length > 0 && l !== "]") {
              try {
                const line = JSON.parse(l);
                controller.enqueue(line);
                batch.push(line);
              } catch (e) {
                controller.error(e);
                cancellationRequest = true;
                reader.cancel();
                return;
              }
            }
          }
          buf = lines[lines.length - 1];
          events.emit("batch", { batch, stats });

          if (l === "]") {
            events.emit("end");
          }

          return reader
            .read()
            .then(processResult)
            .catch((err) => {
              cancellationRequest = true;
              events.emit("cancel");
              return false;
            });
        })
        .catch((err) => {
          cancellationRequest = true;
          cancellationToken.cancel();
        });
    },
    cancel(reason) {
      events.emit("cancel");
      cancellationRequest = true;
      cancellationToken.cancel();
    },
  });

  async function readAll() {
    const reader = stream.getReader();
    const data = [];

    let result: any;

    while (!result || !result.done) {
      result = await reader.read();
      if (result.value) {
        data.push(result.value);
      }
    }
    return data;
  }

  return { stream, events, readAll };
}

export async function req<Q = unknown, S = unknown>(
  opts: RequestOptions<Q>
): Promise<S> {
  const _fetch = tryGetFetch();

  if (typeof _fetch !== "function") {
    return nodeReq(opts);
  }

  const fetchOpts = {
    headers: opts.headers,
    method: opts.method || "GET",
    body: <any>null,
  };

  if (opts.body) {
    fetchOpts.body = opts.body;
    if (typeof fetchOpts.body === "object") {
      fetchOpts.body = JSON.stringify(fetchOpts.body);
    }
  }

  const resp = await _fetch(opts.url, fetchOpts);
  const text = await resp.text();

  if (text.startsWith("<html>") && text.includes("nginx")) {
    throw NginxError.fromHtml(opts, text, resp.status);
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw ApiError.fromJson(opts, err as ApiError, resp.status);
  }
  if (resp.status >= 400) {
    throw ApiError.fromJson(opts, json, resp.status);
  }
  return json;
}

function nodeReadStream<T = unknown>(stream: any) {
  const events = new EventEmitter0();
  const batches: T[][] = [];

  let batch: T[] = [];
  let totalBytes = 0;

  const batchInterval = setInterval(() => {
    const stats = { totalBytes };
    events.emit("batch", { batch, stats });
    batches.push(batch);
    batch = [];
  }, 500);

  let prevTail = "";

  stream.on("data", (data: string) => {
    totalBytes += data.length;

    let text = data.toString();

    if (text.startsWith("[\n")) {
      text = text.slice(1);
      events.emit("start");
    }

    if (prevTail) {
      text = `${prevTail}${text}`;
      prevTail = "";
    }

    let lines = text.split("\n,\n").filter((l) => !!l);
    const last = lines[lines.length - 1];

    if (last && !last.endsWith("]\n")) {
      try {
        JSON.parse(last);
      } catch (err) {
        prevTail = last;
        lines = lines.slice(0, -1);
      }
    }
    if (last && last.endsWith("]\n")) {
      lines[lines.length - 1] = last.slice(0, -2);
    }

    lines = lines.filter((l) => l != "\n");

    for (let l of lines) {
      if (l.startsWith(",\n")) {
        l = l.slice(2);
      }
      if (l === "\n]\n") {
        continue;
      }
      batch.push(JSON.parse(l));
    }
  });

  stream.on("error", (err: any) => {
    events.emit("end", err);
    clearInterval(batchInterval);
  });

  stream.on("end", () => {
    events.emit("end");
    clearInterval(batchInterval);
  });

  return {
    events,
    stream,
    readAll: () =>
      new Promise((resolve, reject) => {
        events.on("error", reject);
        events.on("end", () => {
          if (batch.length) {
            batches.push(batch);
          }
          resolve([].concat(...(batches as any)));
        });
      }),
  };
}

export async function reqReader<Q = unknown, S = unknown>(
  opts: RequestOptions<Q>
): Promise<StreamReader<S>> {
  const _fetch = tryGetFetch();

  if (typeof _fetch !== "function") {
    /* try with node streams */
    const resp = await nodeReq(opts, { returnStream: true });
    return nodeReadStream<S>(resp) as StreamReader<S>;
  }

  const resp = await _fetch(opts.url, {
    headers: opts.headers,
    method: opts.method || "GET",
    body: <any>opts.body || null,
  });

  if (resp.status >= 400) {
    throw ApiError.fromJson(opts, await resp.json(), resp.status);
  }

  return read(resp.body!);
}

export interface ClientOpts {
  url?: string;
  token?: string;
}

export interface StreamReader<T = unknown> {
  events: EventEmitter0;
  stream: ReadableStream<T>;
  readAll?: () => Promise<T[]>;
}

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type WellKnownGet<TProp> = TProp extends keyof WellKnown
  ? WellKnown[TProp]
  : WellKnown["/"];

export interface WellKnown {
  ["/"]: any;
  [""]: any;
}

export interface MoreTypedClient {
  get<P extends string = "/", T = WellKnownGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T[]>;

  post<
    P extends string = "/",
    T = WellKnownGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(
    path: P,
    data: U
  ): Promise<T>;

  patch<
    P extends string = "/",
    T = WellKnownGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(
    path: P,
    data: U
  ): Promise<T>;

  delete<P extends string = "/", T = WellKnownGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T>;
}

export interface Client {
  new (opts?: ClientOpts): Client;

  get<T = unknown>(path: string): Promise<T>;
  post<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;

  /** query params stringification helper */
  qs(params: Record<string, string | string[] | number>): string;
}

export class Client implements Client {
  _opts: ClientOpts;
  url: string;
  token: string;

  constructor(opts: ClientOpts) {
    this._opts = { ...(opts || {}) };

    this.url = this._opts.url!;
    this.token = this._opts.token!;
  }

  getHeaders() {
    const defaults: Record<string, string> = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": `rightech/rest-api client 1.1`,
    };
    if (this.token) {
      defaults.authorization = `Bearer ${this.token}`;
    }
    return defaults;
  }

  resolveUrl(path: string) {
    if (path.startsWith("/")) {
      path = path.replace("/", "");
    }
    if (!path.startsWith(`api/${VERSION}`)) {
      path = `api/${VERSION}/${path}`;
    }
    const url = new URL(path, this.url);
    return url;
  }

  get<T = unknown>(path: string): Promise<T> {
    const url = this.resolveUrl(path);
    const headers = this.getHeaders();

    if (!("ric-stream-hint" in headers)) {
      headers["ric-stream-hint"] = "yes";
    }

    return req({
      method: "GET",
      url: url.toString(),
      headers,
    });
  }

  post<T = unknown>(path: string, data: Partial<T> = {}): Promise<T> {
    return req({
      method: "POST",
      url: this.resolveUrl(path).toString(),
      headers: this.getHeaders(),
      body: data,
    });
  }

  patch<T = unknown>(path: string, data: Partial<T> = {}): Promise<T> {
    return req({
      method: "PATCH",
      url: this.resolveUrl(path).toString(),
      headers: this.getHeaders(),
      body: data,
    });
  }

  delete<T = unknown>(path: string): Promise<T> {
    return req({
      method: "DELETE",
      url: this.resolveUrl(path).toString(),
      headers: this.getHeaders(),
    });
  }

  with(opts: ClientOpts = {}) {
    return new Client({ ...(this._opts || {}), ...opts });
  }

  qs(params: Record<string, string | string[] | number>): string {
    const u = new URL("/", "http://localhost");
    for (const [k, v] of Object.entries(params || {})) {
      u.searchParams.set(k, (v || "").toString());
    }
    return u.search.replace("?", "");
  }

  /* ↓ not part of api right now, 
       very unstable, so experimental, much discouraged */
  getStream<T = unknown>(path: string): Promise<StreamReader<T>> {
    const url = this.resolveUrl(path);
    url.searchParams.set("streamed", "true");
    url.searchParams.set("nolimit", "true");

    const headers = this.getHeaders();
    return reqReader({ url: url.toString(), method: "GET", headers });
  }
}

export function getDefaultClient(opts?: ClientOpts): MoreTypedClient & Client {
  const maybeNode = (globalThis as any)["process"] as any;
  if (maybeNode && maybeNode.env) {
    return new Client({
      url: opts?.url ?? maybeNode.env["RIC_URL"] ?? DEFAULT_BASE_URL,
      token: opts?.token ?? maybeNode.env["RIC_TOKEN"],
    });
  }
  const maybeDeno = (globalThis as any)["Deno"] as any;
  if (maybeDeno && maybeDeno.env) {
    return new Client({
      url: opts?.url ?? maybeDeno.env.get("RIC_URL") ?? DEFAULT_BASE_URL,
      token: opts?.token ?? maybeDeno.env.get("RIC_TOKEN"),
    });
  }
  const maybeLocation = (globalThis as any)["location"] as any;
  if (maybeLocation && maybeLocation.origin) {
    return new Client({
      url: opts?.url ?? maybeLocation.origin,
    });
  }

  return new Client({ url: DEFAULT_BASE_URL });
}

export default getDefaultClient();
