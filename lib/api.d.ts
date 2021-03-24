export declare class ApiError extends Error {
  url: string;
  code: number;
  tags: string[];
  helper: {
    message?: string;
    links?: string[];
  };
}

/// <_include path="@root/lib/api.ts#DeprecatedResponseFields" />
/// <_include path="@root/lib/api.ts#ClientOpts" />
/// <_include path="@root/lib/api.ts#Split" />
/// <_include path="@root/lib/api.ts#WellKnownGet" />
/// <_include path="@root/lib/api.ts#WellKnown" />
/// <_include path="@root/lib/api.ts#MoreTypedClient" />

export declare class Client {
  constructor(opts?: ClientOpts);

  get<T = unknown>(path: string): Promise<T[]>;
  post<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;

  //with(opts?: ClientOpts): Client;
}

export declare function getDefaultClient(opts?: ClientOpts): Client & MoreTypedClient;
declare const _default: Client & MoreTypedClient;
export default _default;
