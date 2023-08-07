import { ObjectId } from "mongodb";

export interface ITableData {
    [key: string]: string[] | string | ObjectId | ObjectId[] | null;
  }