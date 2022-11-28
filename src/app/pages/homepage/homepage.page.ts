import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Document } from 'src/app/shared/storageprop';
import { StorageService } from 'src/app/shared/storage.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../document/modal/modal.page';
import { DocumentData, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {

  userData: User;
  documentsData: Document[] = new Array<Document>;
  documentsShowData: Document[];

  arrayKeyData: Array<string> = [];
  filteredArrayKeyData: Array<string> = [];

  itemPerPage: number = 5;
  maxPageOnItem: number;
  currPage: number = 1;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private modalController: ModalController,
  ) {
    this.userData = this.authService.getUserLocalStorage();
  }

  ngOnInit() {
    this.setAll()
  }

  async openDetail(doc: Document) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        userData: this.userData,
        document: doc
      }
    });
    modal.present();
  }

  handleRefresh(event: any){
    setTimeout(() => {
      this.documentsData = [];
      this.setAll();
      event.target.complete();
    }, 2000);
  }


  // --------------------------------

  get atFirstPage(){
    return this.currPage === 1;
  }

  get atLastPage(){
    return this.currPage === this.maxPageOnItem;
  }

  async prevPage(){
    if(this.currPage > 1){
      this.currPage--;
    }else{
      this.currPage = 1;
    }

    this.renderPage();
  }

  async nextPage(){
    if(this.currPage < this.maxPageOnItem){
      this.currPage++;
    }else{
      this.currPage = this.maxPageOnItem;
    }

    this.renderPage();
  }

  async setAll(){
    //set query dan ambil
    this.storageService.getDocuments().then((res) => {
        res.docs.map((doc) => {

          let tempdoc: Document = {
            id: doc.id,
            title: doc.get('title'),
            url: doc.get('url'),
            kategori: doc.get('kategori'),
            visibility: doc.get('visibility'),
            ownerid: doc.get('ownerid')
          };

          this.documentsData.push(tempdoc);
          // this.mapAllData.set(doc.get('title'), tempdoc);
          this.arrayKeyData.push(doc.get("title"));
        })

        this.filteredArrayKeyData = null;
        // this.documentsShowData = this.documentsData;

        //set maxpage
        const totalItem = this.documentsData.length;
        this.maxPageOnItem = Math.ceil(totalItem/this.itemPerPage);

        // console.log(this.documentsData)
        // console.log(this.mapAllData);
        // console.log(this.arrayKeyData);
        console.log(this.filteredArrayKeyData);
      }).then(() => {
        this.renderPage();
      });

  }

  async searchQuery(event: any){
    let searchKey:string = event.target.value;
    console.log(searchKey);

    let expr = new RegExp(searchKey, "gi");
    this.filteredArrayKeyData = this.arrayKeyData.filter((elem, index)=> expr.test(elem));

    console.log(this.filteredArrayKeyData);

    this.renderPage();
  }

  async renderPage(){

    //render pagination di bawah
    this.documentsShowData = this.documentsData;

    console.log("---------------------");
    console.log("curr page : " + this.currPage);
    console.log("item Per Page : " + this.itemPerPage);
    console.log("total data : " + this.documentsData.length);
    console.log("max page : " + this.maxPageOnItem);

    if (this.filteredArrayKeyData !== null){
      this.documentsShowData = this.documentsShowData
      .filter(doc => this.filteredArrayKeyData.includes(doc.title));

      console.log("filtered", this.documentsShowData);
    }

    let sliceIndex: number = (this.currPage-1)*this.itemPerPage;

    this.documentsShowData = this.documentsShowData
    .slice(sliceIndex, sliceIndex + this.itemPerPage);
    console.log("sliced", sliceIndex, sliceIndex + this.itemPerPage);
    console.log("sliced", this.documentsShowData);

    console.log("######## trigger render");
}
}
