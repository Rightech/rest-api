// export type { ItemId, BaseItem } from "./types/base";

// export type {
//   BaseNode,
//   SystemNode,
//   EventNode,
//   ActionNode,
//   ArgumentNode,
//   ModelNode,
//   Model,
// } from "./types/models";

// export type { BaseConfig, BaseState, Object } from "./types/objects";

export type ItemId = string;

export interface BaseItem {
  _id: ItemId;

  name: string;
  description?: string;

  owner: ItemId;
  group: ItemId;
}

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
