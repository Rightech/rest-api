import type { Base, ItemId } from "./base";

export interface Automaton extends Base {
  model: ItemId;

  /** 
   * State Chart diagram is JSON blob right now
   * and is not part of API v1 Spec 
  */
  data: string;
}
