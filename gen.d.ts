/* ----- api/v1 ----- */

/// <_include path="@root/types/base.d.ts#ItemId" />
/// <_include path="@root/types/base.d.ts#BaseItem" />

export declare class ApiError extends Error {
  url: string;
  code: number;
  tags: string[];
  helper: {
    message?: string;
    links?: string[];
  };
}

export declare class NginxError extends ApiError {
  title: string;
}

export interface ApiResponse {
  success: boolean;
}

export interface ClientOpts {
  url?: string;
  token?: string;
}

export declare class Client {
  url: string;
  token: string;
  constructor(opts: ClientOpts);
  getDefaultHeaders(): {
    [k: string]: string;
  };
  get<T = unknown>(path: string, query?: {}): Promise<T>;
  post<T = unknown>(path: string, data?: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data?: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;
  with(opts?: ClientOpts): Client;
}

/* ----- api/v1/models ----- */

/// <_include path="@root/types/models.d.ts#BaseNode" />
/// <_include path="@root/types/models.d.ts#SystemNode" />
/// <_include path="@root/types/models.d.ts#EventNode" />
/// <_include path="@root/types/models.d.ts#ArgumentNode" />
/// <_include path="@root/types/models.d.ts#ActionNode" />
/// <_include path="@root/types/models.d.ts#ModelNode" />
/// <_include path="@root/types/models.d.ts#Model" />

/* ----- api/v1/objects ----- */

/// <_include path="@root/types/objects.d.ts#BaseState" />
/// <_include path="@root/types/objects.d.ts#BaseConfig" />
/// <_include path="@root/types/objects.d.ts#Object" />
