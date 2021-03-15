import type { BaseItem } from './base';

export type ModelNode = BasicNode
  | ArgumentNode
  | ActionNode
  | EventNode;

export interface BasicNode {
  id: string;
  name: string;
  description?: string;
  active: boolean;

  type: 'subsystem' | string;

  children?: ModelNode[];
}

export interface EventNode extends BasicNode {
  type: 'event';
}

export type ArgumentDataType = 'number' 
| 'boolean' 
| 'string' 
| string;

export interface ArgumentNode extends BasicNode {
  type: 'argument';
  dataType?: ArgumentDataType;
  unit?: string;
}

export interface ActionNode<T = unknown> extends BasicNode {
  type: 'action';
  service?: string;
  command?: string;
  params?: T;
}

export interface Model extends BaseItem {
  base?: string;
  props: ModelProps;

  data: ModelNode;
}

export interface ModelProps {
    bots: boolean;
    helper: string;
    prefix: string;
    order: number;
    protocol: string;
    idPattern: string;
  }