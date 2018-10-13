import { Component } from '@angular/core';
import {  NavController,  AlertController, List } from 'ionic-angular';
import {LoginPage} from '../login/login';
import { App } from 'ionic-angular';
import { map } from 'rxjs/operators';
import 'rxjs/Rx';

import {Http, Headers, Response} from "@angular/http";
import { Camera,CameraOptions } from '@ionic-native/camera';
import { GoogleCloudVisionServiceProvider } from '../../providers/googlecloud-vision-service/googlecloud-vision-service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  userId: string;
  public base64Image: string;
  private imagesArray : List;

  public visionResult : string
  constructor(public appCtrl: App, public navCtrl: NavController, public alertCtrl: AlertController, private camera: Camera, private http: Http, private vision: GoogleCloudVisionServiceProvider) {
  }
  Capture(){
    console.log("Camera is called");
    const options : CameraOptions = {
      quality : 100,
      destinationType : this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    };
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;

      const body = {
        "requests": [
          {
            "image": {
              "content": imageData
            },
            "features": [
              {
                "type": "TEXT_DETECTION",
                "maxResults":10

              }
            ]
          }
        ]
      }


      this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCaV274H-URjgGYG_QWKQe_tmSemKSAQTg', body).pipe(map(res => res.json())).subscribe(data =>
      {
        console.log(data);
        if(data != null && data != "undefined"
          && data.responses != null && data.responses[0] != null && data.responses[0] != "undefined" &&
          data.responses[0].textAnnotations != null && data.responses[0].textAnnotations[0] != null
          && data.responses[0].textAnnotations[0] != "undefined"){
          this.visionResult = data.responses[0].textAnnotations[0].description;
        }else{
          let alert = this.alertCtrl.create({
            title: 'Data',
            subTitle: "No Text Detected from the Image !!",
            buttons: ['OK']
          });
          alert.present();
        }
      }, error => {
        this.visionResult = "Google Translate Break through language barrie";
        let alert = this.alertCtrl.create({
          title: 'Failure',
          subTitle: error,
          buttons: ['OK']
        });
        console.log(error);// Error getting the data
      });
    });
  };
  logout()
  {
    this.appCtrl.getRootNav().setRoot(LoginPage);

  }
}
