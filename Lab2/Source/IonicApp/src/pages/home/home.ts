import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private city: any;
  private searchKeyword: any;
  //private condition: any;
  public restaurents: any;

  constructor(public navCtrl: NavController, private http: HttpClient, public alertCtrl: AlertController) {

  }

  goBack() {
    this.navCtrl.setRoot(LoginPage);
  }

  showAlert(a) {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: a,
      buttons: ['OK']
    });
    alert.present(alert);
  }

  getdetails() {
    if (this.city == null || this.searchKeyword == "" || this.city == null || this.searchKeyword == "") {
      this.showAlert('Enter City and SearchKeyword');
    } else {
      this.http.get('https://api.foursquare.com/v2/venues/search?client_id=NTAUYPH1YIVXKZO4IHAFMBEQKJGDZ5URV2NRJJXYK2ZTLZZE&' +
        'client_secret=FZNYKYV4JDBSZMKSPQNHFDZWMFRR114WALWHRPGGV3YOTBXR&v=20160215&limit=5&near=' + this.city + '&query=' + this.searchKeyword)
        .subscribe(
          (res: any) => {
            this.restaurents = res.response.venues;
            console.log(this.restaurents);
          }
        )
    }
  }
}
