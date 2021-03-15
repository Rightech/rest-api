export const CODES = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a Teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required",
};

export interface ApiResponse {
  success: boolean;
}

export type ApiErrorHelper = {
  message?: string;
  links?: string[];
};

export type KVM = { [k: string]: string };

export type RequestOptions<T = unknown> = {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: KVM;
  body?: T;
};

function unique<T = unknown>(array: T[] = []) {
  return array.filter((item, pos, self) => {
    return self.indexOf(item) === pos;
  });
}

export class ApiError extends Error {
  jti: string = "";
  url: string = "";
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
    //this.trySetTokenId();
  }

  trySetTokenId() {
    // const [, b64] = (getToken() || '').split('.');
    // if (b64) {
    //   try {
    //     // TODO: move to ./base64.ts decode
    //     const payload = Buffer.from(b64, 'base64').toString();
    //     this.jti = JSON.parse(payload).jti || '';
    //   } catch (err) {}
    // }
  }

  withTags(tags: string[] = []) {
    this.tags = unique([...this.tags, ...(tags || [])]);
    return this;
  }

  withHelper(helper: ApiErrorHelper) {
    this.helper = helper;
    return this;
  }

  withCode(code: number) {
    this.code = +code;
    return this;
  }

  withUrl(url: string) {
    this.url = url;
    return this;
  }

  static fromJson(opts: RequestOptions, json: ApiError, statusCode = 500) {
    return new ApiError(json.message)
      .withCode(statusCode)
      .withTags(json.tags)
      .withHelper(json.helper || {})
      .withUrl(opts.url);
  }
}

export class NginxError extends ApiError {
  title: any = "";

  withTitle(title = "") {
    this.title = title;
    return this;
  }

  static fromHtml(opts: RequestOptions, resp = "", statusCode = 500) {
    let [, title = "Unknown nginx errror"] =
      /<title>(.*?)<\/title>/gi.exec(resp) || [];
    title = title.replace(statusCode.toString(), "").trim();

    return new NginxError(CODES[statusCode])
      .withCode(statusCode)
      .withTitle(title)
      .withUrl(opts.url);
  }
}

export function nodeReq<Q = unknown, S = unknown>(
  opts: RequestOptions<Q>
): Promise<S> {
  const { protocol, hostname, port, pathname } = new URL(opts.url);

  const proto = protocol === "https:" ? require("https") : require("http");

  const options = {
    method: "GET",
    host: hostname,
    port: +port,
    path: pathname,
    ...opts,
  };

  if (!port) {
    options.port = protocol === "https:" ? 443 : 80;
  }

  return new Promise((resolve, reject) => {
    const req = proto.request(options, (res) => {
      let resp = "";
      res.on("data", (chunk) => (resp += chunk.toString()));
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
    });

    req.on("error", (err) => reject(err));

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

export async function req<Q = unknown, S = unknown>(
  opts: RequestOptions<Q>
): Promise<S> {
  if (typeof fetch !== "function") {
    return nodeReq(opts);
  }

  const resp = await fetch(opts.url, {
    headers: opts.headers,
    method: opts.method || "GET",
    body: <any>opts.body || null,
  });

  const json = await resp.json();

  if (resp.status >= 400) {
    throw ApiError.fromJson(opts, json, resp.status);
  }

  return json;
}

export interface ClientOpts {
  url?: string;
  token?: string;
}

export class Client {
  _opts: ClientOpts;
  url: string;
  token: string;

  constructor(opts: ClientOpts) {
    this._opts = { ...(opts || {}) };

    this.url = this._opts.url!;
    this.token = this._opts.token!;
  }

  getDefaultHeaders() {
    const defaults: KVM = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": `rightech/rest-api client 1.1`,
    };
    if (this.token) {
      defaults.authorization = `Bearer ${this.token}`;
    }
    return defaults;
  }

  get<T = unknown>(path: string, query = {}): Promise<T> {
    const url = new URL(path, this.url);
    const headers = this.getDefaultHeaders();
    return req({ url: url.toString(), method: "GET", headers });
  }

  post<T = unknown>(path: string, data: Partial<T> = {}): Promise<T> {
    const url = new URL(path, this.url);
    const headers = this.getDefaultHeaders();
    return req({ url: url.toString(), method: "POST", headers, body: data });
  }

  patch<T = unknown>(path: string, data: Partial<T> = {}): Promise<T> {
    const url = new URL(path, this.url);
    const headers = this.getDefaultHeaders();
    return req({ url: url.toString(), method: "PATCH", headers, body: data });
  }

  delete<T = unknown>(path: string): Promise<T> {
    const url = new URL(path, this.url);
    const headers = this.getDefaultHeaders();
    return req({ url: url.toString(), method: "DELETE", headers });
  }

  with(opts: ClientOpts = {}) {
    return new Client({ ...(this._opts || {}), ...opts });
  }
}
