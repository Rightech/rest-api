import type { Base, ItemId } from "./base";

export interface User extends Base {
  role: ItemId;

  /** 
    @validate required, unique
  */
  email: string;

  /** 
    @validate required, unique, alphanumeric, min:4, max:40
  */
  login: string;

  /* not stored in db and logs */
  password?: string;

  phone: string;
  locale: string;
  timezoneOffset: number;
}
