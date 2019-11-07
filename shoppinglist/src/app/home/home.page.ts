import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

interface Itemtoken {
  id: string,
  title: string,
  isChecked: boolean,
  isDeleted: boolean,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  inputValue: string;
  private itemtoken: Itemtoken;
  mylist = [];
  history = [];
  searhHistory = [];
  isItemAvailable = false;

  constructor(private storage: Storage) {
    this.storage.ready().then(() => {
      this.storage.forEach((v, k) => {
        if (v.isDeleted === false) {
          this.mylist.push(v);
        }
        this.history.push(v.title);
        console.log(this.history);
      });
    });
  }

  search(event) {
    console.log(event);
    this.searhHistory = this.history;
    console.log(this.searhHistory);
    // set val to the value of the searchbar
    const val = event.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.searhHistory = this.searhHistory.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
   } else {
    this.isItemAvailable = false;
   }
  }

  itemSelected(selected: string): void {
    this.inputValue = selected;
    this.isItemAvailable = false;

}

  addItem() {
    this.itemtoken = {id: '', title: '', isChecked: false, isDeleted: false};
    this.itemtoken.id = Math.random().toString(36).substr(2, 10);
    this.itemtoken.title = this.inputValue;
    this.itemtoken.isChecked = false;
    this.itemtoken.isDeleted = false;
    //Añadimos item al array
    this.mylist.push(this.itemtoken);
    this.history.push(this.itemtoken.title);
    console.log(this.history);
    this.inputValue = '';
    this.storage.ready().then(() => {
      this.storage.set(this.itemtoken.id, this.itemtoken);
    });
  }

  deleteItem(item) {
    const index = this.mylist.indexOf(item);

    if (index > -1) {
      this.mylist.splice(index, 1);
      this.storage.ready().then(() => {
        item.isDeleted = true;
        this.storage.set(item.id, item);
      });
    }
  }

  modifyValue(e): void {
    console.log(!e.isChecked);
    this.itemtoken = {id: '', title: '', isChecked: false, isDeleted: false};
    this.storage.get(e.id).then(
      (item) => {
        if (item) {
          this.itemtoken.id = item.id;
          this.itemtoken.title = item.title;
          this.itemtoken.isChecked = e.isChecked;
          this.itemtoken.isDeleted = item.isDeleted;
          console.log('item' + this.itemtoken);
          this.setStorage(this.itemtoken);
        }
      });
  }

  setStorage(item): void {
    console.log('set'+ item.id);
    this.storage.ready().then(() => {
      this.storage.set(item.id, item);
    });
  }
}
