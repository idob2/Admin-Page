import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService';
import { IChef } from '../interfaces/chef.interface';
import { ITableData } from '../interfaces/table.interface';
import { IRestaurant } from '../interfaces/restaurants.interface';
import { IDish } from '../interfaces/dish.interface';

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
  selectedContent: string = '';


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
    } catch (error: any) {
      console.error(error.message);
    }
  }

  displayContent(buttonNumber: number) {
    this.responseData = {};
    this.newEntity = null;
    switch (buttonNumber) {
      case 1:
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
        case 2:
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
        case 3:
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
        this.selectedContent = 'null';
        break;
    }
  }

  getValue(row: ITableData, key: string): any {
    return row[key.toLowerCase()];
  }


  toggleEditMode(key: string) {
    this.editModeMap[key] = !this.editModeMap[key];
  }

  handleDataSaved(data: { data: ITableData; id: string }): void {
    try {
      this.dataService.updateData(this.selectedContent, data.id, data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  handleDataDeleted(id: { id: string }): void {
    try {
      this.dataService.deleteData(this.selectedContent, id.id);
    } catch (error: any) {
      console.log(error.message);
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
    }
   
  }

  saveNewEntity(): void{
    console.log('Saving new entity:', this.newEntity);
    this.dataService.postData(this.selectedContent, this.newEntity);
    this.newEntity = {};
  }
}
