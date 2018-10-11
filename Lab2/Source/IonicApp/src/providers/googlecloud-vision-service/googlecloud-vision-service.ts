import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {map} from 'rxjs/operators';
import { googleCloudVisionAPIKey } from '../../config';

@Injectable()
export class GoogleCloudVisionServiceProvider {

  constructor(public http: Http) { }

  getLabels(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
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


    // this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body).subscribe(result =>{
    // console.log("Result:", JSON.stringify(result))
    // })
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + googleCloudVisionAPIKey, body).pipe(map(res => res.json()));

  }

}
