import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService';
import { IChef } from '../interfaces/chef.interface';
import { ITableData, IDropdownOption } from '../interfaces/table.interface';
import { IRestaurant } from '../interfaces/restaurants.interface';
import { IDish } from '../interfaces/dish.interface';
import { getErrorMessage } from '../utils/error.utils';
import { ObjectId } from 'mongodb';
import { uploadService } from '../service/cloudinaryService';
import { Router } from '@angular/router';
import { AuthService } from '../service/authService';

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
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  isEditing: boolean = false;
  dropdownOptions: { [headerTitle: string]: IDropdownOption[] } = {};

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.fetchAllData();
      this.displayContent('chefs');
    } catch (error) {
      console.error({ message: getErrorMessage(error) });
    }
  }
  async fetchAllData() {
    const [chefsData, restaurantsData, dishesData] = await Promise.all([
      this.dataService.fetchChefData(),
      this.dataService.fetchRestaurantData(),
      this.dataService.fetchDishData(),
    ]);
    this.chefs = chefsData;
    this.restaurants = restaurantsData;
    this.dishes = dishesData;
  }

  displayContent(collection: string) {
    this.responseData = {};
    this.newEntity = null;
    this.isEditing = false;
    switch (collection) {
      case 'chefs':
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
      case 'restaurants':
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
      case 'dishes':
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

  getValue(
    row: ITableData,
    key: string
  ): string[] | string | ObjectId | ObjectId[] | number | null {
    return row[key.toLowerCase()];
  }

  toggleEditMode(key: string) {
    this.editModeMap[key] = !this.editModeMap[key];
  }

  async handleDataSaved(data: { data: ITableData; id: string }) {
    try {
      console.log(data);
      const respone = await this.dataService.updateData(
        this.selectedContent,
        data.id,
        data.data
      );
        await this.fetchAllData();
        alert("Uploaded the data");
        this.displayContent(this.selectedContent);
    } catch (error) {
      this.router.navigate(['/login-page']);
      console.error({ message: getErrorMessage(error) });
    }
  }

  async handleDataDeleted(id: { id: string }) {
    try {
      await this.dataService.deleteData(this.selectedContent, id.id);
      await this.fetchAllData();
      this.displayContent(this.selectedContent);
    } catch (error) {
      this.router.navigate(['/login-page']);
      console.error({ message: getErrorMessage(error) });
    }
  }
  editModeToggled(editCond:boolean){
    this.isEditing = editCond;
  }
  createNewEntity(): void {
    try {
      if (this.selectedContent === '') {
        alert("Can't add entity to undifined collection!");
      } else {
        this.newEntity = {};
        this.headerTitles.forEach((headerTitle) => {
          this.newEntity![headerTitle.toLowerCase()] = '';
        });
        this.newEntity['dishes'] = [];
        this.newEntity['restaurants'] = [];
        this.newEntity['restaurant'] = null;
        this.newEntity['chef'] = null;
      }
    } catch (error) {
      this.router.navigate(['/login-page']);
      console.error({ message: getErrorMessage(error) });
    }
  }

  async saveNewEntity() {
    try {
      if (this.selectedContent === 'dishes') {
        delete this.newEntity!['restaurant_name'];
      }
      if (this.newEntity) {
        this.newEntity['image'] = await this.uploadImage();
        await this.dataService.postData(this.selectedContent, this.newEntity);
        this.newEntity = {};
      }
      await this.fetchAllData();
      this.displayContent(this.selectedContent);
    } catch (error) {
      if(getErrorMessage(error) === 'Invalid token'){
        this.router.navigate(['/login-page']);
      }
      alert('Fill the fields  correctly!');
      console.error({ message: getErrorMessage(error) });
    }
  }

  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.imageUrl = URL.createObjectURL(this.selectedFile); 
    }
  }

  async uploadImage() {
    try {
      if (this.selectedFile) {
        const result = await uploadService.uploadImg(this.selectedFile);
        return result['secure_url'];
      }
      return '';
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  logout(): void {
    this.authService.deleteCookie();
    this.router.navigate(['/login-page']);
  }

  shouldBeInput(headerTitle: string) {
    return ![
      'restaurants_names',
      '_id',
      'dishes_names',
      'restaurant_name',
      'chef_name',
    ].includes(headerTitle.toLowerCase());
  }

  handleRequestDropdownOptions(headerTitle: string) {
    let options: IDropdownOption[] = [];
    if (this.headerTitles.includes('restaurants')) {
      options = this.restaurants.map((restaurant) => ({
        label: restaurant.name,
        value: restaurant._id,
      }));
      this.dropdownOptions['restaurants'] = options;
    }
    if (this.headerTitles.includes('restaurant')) {
      options = this.restaurants.map((restaurant) => ({
        label: restaurant.name,
        value: restaurant._id,
      }));
      this.dropdownOptions['restaurant'] = options;
    }
    if (this.headerTitles.includes('chef')) {
      options = this.chefs.map((chef) => ({
        label: chef.name,
        value: chef._id,
      }));
      this.dropdownOptions['chef'] = options;
    }
    if (this.headerTitles.includes('dishes')) {
      options = this.dishes.map((dish) => ({
        label: dish.name,
        value: dish._id,
      }));
      this.dropdownOptions['dishes'] = options;
    }
    if (this.headerTitles.includes('tags')) {
      options = [
        { label: 'spicy', value: 'spicy' },
        { label: 'vegeterian', value: 'vegeterian' },
        { label: 'vegan', value: 'vegan' },
        { label: 'none', value: 'none' },
      ];
      this.dropdownOptions['tags'] = options;
    }
    if(this.headerTitles.includes('ranking')) {
      options = [
        { label: 'One Star', value: 'one-star' },
        { label: 'Two Stars', value: 'two-stars' },
        { label: 'Three Stars', value: 'three-stars' },
        { label: 'Four Stars', value: 'four-stars' },
        { label: 'Five Stars', value: 'five-stars' },
      ];
      this.dropdownOptions['ranking'] = options;
    }
  }
}
