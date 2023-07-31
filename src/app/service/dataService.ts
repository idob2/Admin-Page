import { Injectable } from '@angular/core';
import axios from 'axios'; // Import Axios
import { IChef } from '../interfaces/chef.interface';
import { IRestaurant } from '../interfaces/restaurants.interface';
import { IDish } from '../interfaces/dish.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private API_BASE_URL = 'http://localhost:3000/api/v1';

  constructor() {}

  async fetchChefData() {
    const response = await axios.get(`${this.API_BASE_URL}/chefs`);
    const chefs: IChef[] = response.data;

    return chefs.map((chef: IChef) => ({
      _id: chef._id,
      name: chef.name,
      restaurants: chef.restaurants,
      image: chef.image,
      description: chef.description,
    }));
  }

  async fetchRestaurantData() {
    const response = await axios.get(`${this.API_BASE_URL}/restaurants`);
    const restaurants: IRestaurant[] = response.data;

    return restaurants.map((restaurant: IRestaurant) => ({
      _id: restaurant._id,
      name: restaurant.name,
      image: restaurant.image,
      chef: restaurant.chef,
      dishes: restaurant.dishes,
    }));
  }

  async fetchDishData() {
    const response = await axios.get(`${this.API_BASE_URL}/dishes`);
    const dishes: IDish[] = response.data;
    return dishes.map((dish: IDish) => ({
      _id: dish._id,
      name: dish.name,
      image: dish.image,
      price: dish.price,
      ingredients: dish.ingredients,
      tags: dish.tags,
      restaurant: dish.restaurant,
    }));
  }

  async updateData(collectionType: string, id: string, data: {}) {
    const response = await axios.put(
      `${this.API_BASE_URL}/${collectionType}/${id}`,
      data
    );
  }

  async deleteData(collectionType: string, id: string) {
    const response = await axios.delete(
      `${this.API_BASE_URL}/${collectionType}/${id}`
    );
  }
}
