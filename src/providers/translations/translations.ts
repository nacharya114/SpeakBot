import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Message } from '../../models/message';
import { User } from '../user/user';

const ENDPOINT = "translate";

/*
  Generated class for the TranslationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslationsProvider {

  targetLanguage: String;


  constructor(public http: HttpClient, private api: Api, private user: User) {
    console.log('Hello TranslationsProvider Provider');
    if (this.user.getUser().nativeLanguage) {
      this.targetLanguage = this.user.getUser().nativeLanguage;
    } else {
      this.targetLanguage = "en-US";
    }
  }

  public translateMessage(content: String, sourceLang: String) {
    var p = new Promise((resolve, reject) => {
      this.api.get(ENDPOINT, {"content": content, "target": this.targetLanguage, "source": sourceLang}).subscribe((trans) => {
        resolve(trans['translation']);
      });
    });
    return p;
  }

}
