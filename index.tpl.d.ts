/// <_include path="@root/index.api.d.ts" />

/* ----- client lib ----- */

/// <_include path="@root/lib/api.ts#ApiErrorHelper" />
/// <_include path="@root/lib/api.ts#ApiError" />
/// <_include path="@root/lib/api.ts#DeprecatedResponseV1" />
/// <_include path="@root/lib/api.ts#DeprecatedResponseV2" />
/// <_include path="@root/lib/api.ts#DeprecatedResponse" />
/// <_include path="@root/lib/api.ts#ClientOpts" />
/// <_include path="@root/lib/api.ts#Client" />
/// <_include path="@root/lib/api.ts#Split" />
/// <_include path="@root/lib/api.ts#WellKnownGet" />
/// <_include path="@root/lib/api.ts#WellKnown" />
/// <_include path="@root/lib/api.ts#MoreTypedClient" />

/* ----- client lib exports ----- */

export declare function getDefaultClient(opts?: ClientOpts): Client & MoreTypedClient;
declare const _default: Client & MoreTypedClient;
export default _default;
