import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios'; 
import { IChef } from '../interfaces/chef.interface';
import { IRestaurant } from '../interfaces/restaurants.interface';
import { IDish } from '../interfaces/dish.interface';
import { ITableData } from '../interfaces/table.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private API_BASE_URL = 'http://localhost:3000/api/v1';

  constructor() {}

  async fetchChefData() {
    const response = await axios.get(`${this.API_BASE_URL}/chefs`);
    const chefs: IChef[] = response.data;


    const chefPromises: Promise<AxiosResponse<IChef>>[] = [];

    for (const chef of chefs) {
      const chefPromise = axios.get(
        `${this.API_BASE_URL}/chefs/${chef._id}/restaurants`
      );
      chefPromises.push(chefPromise);
    }
    const chefResponses = await Promise.all(chefPromises);
    const restaurantsWithChefAndDishes = chefs.map(
      (chef:IChef, index: number) => {
        return {
          _id: chef._id,
          name: chef.name,
          image: chef.image,
          restaurants: chef.restaurants,
          restaurants_names: ["chefResponses[index].name,"], // nedd to fix for later!!
          description: chef.description,
        };
      }
    );
    return restaurantsWithChefAndDishes;

  }


  async fetchRestaurantData() {
    const response = await axios.get(`${this.API_BASE_URL}/restaurants`);
    const restaurants: IRestaurant[] = response.data;

    const chefAndDishesPromises: Promise<AxiosResponse<any>>[] = [];

    for (const restaurant of restaurants) {
      const chefPromise = axios.get(
        `${this.API_BASE_URL}/chefs/${restaurant.chef}`
      );
      const dishesPromise = axios.get(
        `${this.API_BASE_URL}/restaurants/${restaurant._id}/dishes`
      );
      chefAndDishesPromises.push(chefPromise);
      chefAndDishesPromises.push(dishesPromise);
    }
    const chefAndDishesResponses = await Promise.all(chefAndDishesPromises);

    const restaurantsWithChefAndDishes = restaurants.map(
      (restaurant: IRestaurant, index: number) => {
        const chefResponse = chefAndDishesResponses[index * 2];
        const dishesResponse = chefAndDishesResponses[index * 2 + 1];

        return {
          _id: restaurant._id,
          name: restaurant.name,
          image: restaurant.image,
          chef: restaurant.chef,
          chef_name: chefResponse.data.name,
          dishes: restaurant.dishes,
          dishes_names: dishesResponse.data.dishes.map(
            (dish: { name: string }) => dish.name
          ),
          ranking: restaurant.ranking,
        };
      }
    );
    return restaurantsWithChefAndDishes;
  }

  async fetchDishData() {
    const response = await axios.get(`${this.API_BASE_URL}/dishes`);
    const dishes: IDish[] = response.data;

    const restaurantPromises: Promise<AxiosResponse<IRestaurant>>[] = [];

    for (const dish of dishes) {
      const restaurantPromise = axios.get(
        `${this.API_BASE_URL}/restaurants/${dish.restaurant}`
      );
      restaurantPromises.push(restaurantPromise);
    }

    const restaurantResponses = await Promise.all(restaurantPromises);

    const dishesWithRestaurantName = dishes.map(
      (dish: IDish, index: number) => ({
        _id: dish._id,
        name: dish.name,
        image: dish.image,
        price: dish.price,
        ingredients: dish.ingredients,
        tags: dish.tags,
        restaurant: dish.restaurant,
        restaurant_name: restaurantResponses[index].data.name, 
      })
    );

    return dishesWithRestaurantName;
  }

  async updateData(collectionType: string, id: string, data: {}) {
    const response = await axios.put(
      `${this.API_BASE_URL}/${collectionType}/${id}`,
      data
    );
  return(response.data);
  }

  async deleteData(collectionType: string, id: string) {
    const response = await axios.delete(
      `${this.API_BASE_URL}/${collectionType}/${id}`
    );
  }

  async postData(collectionType: string, data: ITableData | null) {
    const response = await axios.post(
      `${this.API_BASE_URL}/${collectionType}`,
      data
    );
  }
}
