import { ObjectId } from "mongodb";

export interface IChef {
    _id: string;
    name: string;
    image: string;
    description: string;
    restaurants: ObjectId[];
    restaurants_names: string[];
}