import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService';
import { IChef } from '../interfaces/chef.interface';
import { ITableData } from '../interfaces/table.interface';
import { IRestaurant } from '../interfaces/restaurants.interface';
import { IDish } from '../interfaces/dish.interface';
import {getErrorMessage} from '../utils/error.utils';
import { ObjectId } from 'mongodb';
import {uploadService} from '../service/cloudinaryService';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  chefs: IChef[] = [];
  restaurants: IRestaurant[] = [];
  dishes: IDish[] = [];
  newEntity: ITableData | null = null;
  responseData: { [key: string]: ITableData[] } = {};
  headerTitles: string[] = [];
  editModeMap: { [key: string]: boolean } = {};
  selectedContent: string  = '';
  imageUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(private dataService: DataService) {}

  async ngOnInit(): Promise<void> {
    try {
      const [chefsData, restaurantsData, dishesData] = await Promise.all([
        this.dataService.fetchChefData(),
        this.dataService.fetchRestaurantData(),
        this.dataService.fetchDishData(),
      ]);
      this.chefs = chefsData;
      this.restaurants = restaurantsData;
      this.dishes = dishesData;
      this.displayContent("chefs");
    } catch (error) {
      console.error({message: getErrorMessage(error)});
    }

  }

  displayContent(collection: string) {
    this.responseData = {};
    this.newEntity = null;
    switch (collection) {
      case "chefs":
        this.chefs.forEach((chef) => {
          if (!this.responseData[chef._id]) {
            this.responseData[chef._id] = [];
          }
          this.responseData[chef._id].push({
            ...chef,
          });
        });
        this.headerTitles = Object.keys(this.chefs[0]);
        this.selectedContent = 'chefs';
        break;
        case "restaurants":
          this.restaurants.forEach((restaurant) => {
            if (!this.responseData[restaurant._id]) {
              this.responseData[restaurant._id] = [];
            }
            this.responseData[restaurant._id].push({
              ...restaurant,
            });
          });
          this.headerTitles = Object.keys(this.restaurants[0]);
          this.selectedContent = 'restaurants';
          break;
        case "dishes":
          this.dishes.forEach((dishe) => {
            if (!this.responseData[dishe._id]) {
              this.responseData[dishe._id] = [];
            }
            this.responseData[dishe._id].push({
              ...dishe,
            });
          });
          this.headerTitles = Object.keys(this.dishes[0]);
          this.selectedContent = 'dishes';
        break;
      default:
        this.selectedContent = '';
        break;
    }
  }

  getValue(row: ITableData, key: string): string[] | string  | ObjectId | ObjectId[] | null{
    return row[key.toLowerCase()];
  }


  toggleEditMode(key: string) {
    this.editModeMap[key] = !this.editModeMap[key];
  }

 async handleDataSaved(data: { data: ITableData; id: string }){
    try {
      const respone = await this.dataService.updateData(this.selectedContent, data.id, data.data);
    } catch (error) {
      console.error({message: getErrorMessage(error)});
    }
  }

  handleDataDeleted(id: { id: string }): void {
    try {
      this.dataService.deleteData(this.selectedContent, id.id);
    } catch (error) {
      console.error({message: getErrorMessage(error)});
    }
  }


  createNewEntity(): void {
    if(this.selectedContent === ''){
      alert("Can't add entity to undifined collection!");
    }else{
      this.newEntity = {};
      this.headerTitles.forEach((headerTitle) => {
        this.newEntity![headerTitle.toLowerCase()] = '';
      });
      this.newEntity['dishes'] = null;
      this.newEntity['restaurants'] = null;
      this.newEntity['restaurant'] = null;
      this.newEntity['chef'] = null;
    }
   
  }

  async saveNewEntity(){
    if(this.selectedContent === 'dishes'){

      delete this.newEntity!['restaurant_name'];
    }
    if (this.newEntity){
      this.newEntity['image'] = await this.uploadImage();
      this.dataService.postData(this.selectedContent, this.newEntity);
      this.newEntity = {};
    }
  }


  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }


  async uploadImage() {
    try {
      if(this.selectedFile){
        const result = await uploadService.uploadImg(this.selectedFile);
        return result['secure_url'];
      }
      return "";
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
}
