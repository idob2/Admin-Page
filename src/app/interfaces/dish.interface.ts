import { ObjectId } from "mongodb";

export interface IDish{
    _id: string;
    name: string;
    price: string;
    image: string;
    ingredients: string;
    tags: string;
    restaurant_name: string;
    restaurant: ObjectId;
}