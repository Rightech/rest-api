import type { BaseItem } from "./base";

export type BaseNode = {
  type: string;
  id: string;
  name: string;
  description?: string;
  active: boolean;
  children?: ModelNode[];
};

export type SystemNode = BaseNode & {
  type: "subsystem";
};

export type EventNode = BaseNode & {
  type: "event";
};

export type ActionNode = BaseNode & {
  type: "action";
  service: string;
  command?: string;
  params?: Record<string, string>;
};

export type ArgumentNode = BaseNode & {
  type: "argument";
  dataType: ArgumentDataType;
  unit?: string;
};

export type ArgumentDataType =
  | "number"
  | "boolean"
  | "string"
  | "object"
  | string;

export type ModelNode =
  | BaseNode
  | SystemNode
  | EventNode
  | ArgumentNode
  | ActionNode;

export type ModelProps = {
  bots?: boolean;
  protocol?: string;
  idPattern?: string;
};

export interface Model extends BaseItem {
  base: string;
  data: ModelNode;
  props?: ModelProps;
}
