import { Component } from '@angular/core';
import { NavController,AlertController,NavParams } from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private username: any;
  private password: any;
  constructor(public navCtrl: NavController,public navParams: NavParams,public alertCtrl: AlertController) {
  }

  showAlert(a){
    let alert=this.alertCtrl.create({
      title: 'Alert!',
      subTitle: a,
      buttons: ['OK']
    });
    alert.present(alert);
  }
  reg()
  {
    this.navCtrl.push(RegisterPage);
  }
  home(){
    if (this.username == null || this.username == "" || this.password == null || this.password == "") {
      this.showAlert('Enter UserName and Password');
    } else if (this.username == "Anvesh" && this.password == "Anvesh") {
      this.showAlert('Login Successfully');
      this.navCtrl.push(HomePage);
    } else {
      this.showAlert('Incorrect Username and Password Please check Credentials');
    }
  }
}

