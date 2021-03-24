/* ----- api/v1 ----- */

export interface BaseItem {}

/// <_include path="@root/types/base.d.ts#ItemId" />
/// <_include path="@root/types/base.d.ts#BaseItem" />

/* ----- api/v1/models ----- */

/// <_include path="@root/types/models.d.ts#BaseNode" />
/// <_include path="@root/types/models.d.ts#SystemNode" />
/// <_include path="@root/types/models.d.ts#EventNode" />
/// <_include path="@root/types/models.d.ts#ActionNode" />
/// <_include path="@root/types/models.d.ts#ArgumentNode" />
/// <_include path="@root/types/models.d.ts#ArgumentDataType" />
/// <_include path="@root/types/models.d.ts#ModelNode" />

/// <_include path="@root/types/models.d.ts#ModelProps" />
/// <_include path="@root/types/models.d.ts#Model" />

/* ----- api/v1/objects ----- */
/// <_include path="@root/types/objects.d.ts#ServiceState" />
/// <_include path="@root/types/objects.d.ts#BaseState" />
/// <_include path="@root/types/objects.d.ts#BaseConfig" />
/// <_include path="@root/types/objects.d.ts#RicObject" />
/// <_include path="@root/types/objects.d.ts#Object" />


/* ----- api/v1/events ----- */
/// <_include path="@root/types/events.d.ts#Event" />

/* ----- client lib ----- */

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
/// <_include path="@root/types/index.d.ts#WellKnown" />
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
