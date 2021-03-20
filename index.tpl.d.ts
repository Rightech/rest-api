/* ----- api/v1 ----- */

interface BaseItem {}

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

export interface ClientOpts {
  url?: string;
  token?: string;
}

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type TypeRegistryGet<TProp> = TProp extends keyof TypeRegistry
  ? TypeRegistry[TProp]
  : TypeRegistry["base"];

export interface TypeRegistry {
  base: BaseItem;
}

/// <_include path="@root/types/_reg.d.ts#TypeRegistry" />

export declare class Client {
  constructor(opts?: ClientOpts);

  get<P extends string = "base", T = TypeRegistryGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T[]>;

  post<
    P extends string = "base",
    T = TypeRegistryGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(path: P, data: U): Promise<T>;

  patch<
    P extends string = "base",
    T = TypeRegistryGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(path: P, data: U): Promise<T>;

  delete<P extends string = "base", T = TypeRegistryGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T>;

  get<T = unknown>(path: string): Promise<T[]>;
  post<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;

  with(opts?: ClientOpts): Client;
}

export declare function getDefaultClient(opts?: ClientOpts): Client;
declare const _default: Client;
export default _default;
