import type { BaseItem, ItemId } from "./base";

export type BaseState = {
  [argumentId: string]: number | boolean | string | object;
};

export type BaseConfig = {
  [parentId: string]: {
    [argumentId: string]: number | boolean | string;
  };
};

export interface Object<TState = BaseState, TConfig = BaseConfig>
  extends BaseItem {
  id: string;
  model: ItemId;

  state?: TState;
  config?: TConfig;
}
