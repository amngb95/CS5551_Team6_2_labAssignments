import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from "../login/login";
import { HttpClient,HttpResponse } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private city: any;
  private searchKeyword: any;
  private condition: any;
  public restaurents: any;
  constructor(public navCtrl: NavController,private http:HttpClient) {

  }
  goBack()
  {
    this.navCtrl.setRoot(LoginPage);
  }
  getdetails(){
this.http.get('https://api.foursquare.com/v2/venues/search?client_id=NTAUYPH1YIVXKZO4IHAFMBEQKJGDZ5URV2NRJJXYK2ZTLZZE&' +
  'client_secret=FZNYKYV4JDBSZMKSPQNHFDZWMFRR114WALWHRPGGV3YOTBXR&v=20160215&limit=5&near='+this.city+'&query='+this.searchKeyword)
  .subscribe(
    (res:any)=>{
      this.restaurents = res.response.venues;
      console.log(this.restaurents);
    }
  )
  }
}
