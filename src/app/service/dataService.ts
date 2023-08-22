import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { IChef } from '../interfaces/chef.interface';
import { IRestaurant } from '../interfaces/restaurants.interface';
import { IDish } from '../interfaces/dish.interface';
import { ITableData } from '../interfaces/table.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private API_BASE_URL = 'http://ec2-3-137-173-135.us-east-2.compute.amazonaws.com:3000/api/v1';
  // private API_BASE_URL = 'http://localhost:3000/api/v1';

  constructor(private cookieService: CookieService) {}

  async fetchChefData() {
      const response = await axios.get(`${this.API_BASE_URL}/chefs/populated`);
      const chefs: IChef[] = response.data;
      return (chefs);
  }
  async fetchRestaurantData() {
    const response = await axios.get(`${this.API_BASE_URL}/restaurants/populated`);
    const restaurants: IRestaurant[] = response.data;
    return restaurants;
  }

  async fetchDishData() {
      const response = await axios.get(`${this.API_BASE_URL}/dishes/populated`);
      const dishes: IDish[] = response.data;
      return dishes;
  }
  
  async updateData(collectionType: string, id: string, data: {}) {
    const token = this.cookieService.get('myToken');
    const response = await axios.put(
      `${this.API_BASE_URL}/${collectionType}/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async deleteData(collectionType: string, id: string) {
    const token = this.cookieService.get('myToken');
    const response = await axios.delete(
      `${this.API_BASE_URL}/${collectionType}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async postData(collectionType: string, data: ITableData | null) {
    const token = this.cookieService.get('myToken');
    const response = await axios.post(
      `${this.API_BASE_URL}/${collectionType}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }


}
