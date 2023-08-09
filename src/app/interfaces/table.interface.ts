import { AxiosRequestConfig, AxiosHeaders } from "axios";
import { ObjectId } from "mongodb";
import { IRestaurant } from "./restaurants.interface";
import { IChef } from "./chef.interface";

export interface ITableData {
    [key: string]: string[] | string | ObjectId | ObjectId[] | null;
  }