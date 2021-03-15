import type { BaseItem } from './base';


export interface BaseNode {
  type: string;
  id: string;
  name: string;
  description?: string;
  active: boolean;
  children?: ModelNode[];
}

export interface SystemNode extends BaseNode {
  type: 'subsystem';
}

export interface EventNode extends BaseNode {
  type: 'event';
}

export interface ArgumentNode extends BaseNode {
  type: 'argument';
  dataType: 'number' | 'boolean' | 'string' | string;
  unit?: string;
}

export interface ActionNode extends BaseNode {
  type: 'action';
  service?: string;

  /** js-doc test 1 */
  command?: string;
  
  /** js-doc test 2 */
  params?: unknown;
}

export type ModelNode = BaseNode
  | SystemNode
  | EventNode
  | ArgumentNode
  | ActionNode;

export interface Model extends BaseItem {
  base: string;
  data: ModelNode;

  props?: {
    bots?: boolean;
    protocol?: string;
    idPattern?: string;
  };
}
