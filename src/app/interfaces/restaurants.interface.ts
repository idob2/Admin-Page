import { ObjectId } from "mongodb";

export interface IRestaurant {
    _id: string;
    name: string;
    image: string;
    chef: ObjectId;
    chef_name:string;
    dishes: ObjectId[];
    dishes_names:string;
    ranking: string;
}