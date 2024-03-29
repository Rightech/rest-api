import type { Base, ItemId } from "./base";

export type TaskReportFieldConfig = {
  type: "number" | "boolean" | "string" | string;
  name: string;
  description?: string;
  required?: boolean;
};

export interface TaskKind extends Base {
  svg: string;
  reportConfig?: {
    filesRequired?: number;
    fields?: TaskReportFieldConfig[];
  };
  statusConfig?: {
    checkStatus?: boolean;
    actions?: Record<string, string[]>;
  };
}

export type TaskStatus = "created" | "assigned" | "inwork" | "closed" | string;
export type TaskResult = "done" | "rejected" | string;

export type TaskReport = {
  result: TaskResult;
  fields: TaskReportField[];
  comment?: string;
};

export type TaskReportField = {
  name: string;
  value: number | boolean | string;
};

export type TaskDeadline = {
  status: TaskStatus;
  time: number;
};

export type TaskReview = {
  /**
   * @apiref `users`
   */
  reviewer: ItemId;
  rating: number;
  comment: string;
};

export type TaskLocation = {
  lat: number;
  lon: number;
  radius: number;
  address: string;
};

export interface Task extends Base {
  /**
   * @apiref `tasks/kinds`
   */
  kind: ItemId;

  /**
   * @apiref `objects`
   */
  object: ItemId;

  /**
   * @apiref `users`
   */
  assignee: ItemId;

  /*
   * 0 - critical (reserved)
   * 1 - high
   * 2 - medium
   * 3 - low
   */
  priority: 1 | 2 | 3 | number;
  status: TaskStatus;

  subtasks?: Task[];

  report?: TaskReport;
  review?: TaskReview;

  deadlines?: Record<TaskStatus, TaskDeadline>;

  location?: {
    begin?: TaskLocation;
    end?: TaskLocation;
  };

  tags?: string[];
  json?: unknown;
}
