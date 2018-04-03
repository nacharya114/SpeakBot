import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    let p = new Promise((resolve, reject)=> {
      seq.subscribe((res: any) => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
          resolve(res);
        } else if (res.status == 'error'){
          this.logout();
          reject(res);
        }
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });

    return p;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    let p = new Promise((resolve, reject)=> {
      seq.subscribe((res: any) => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
          resolve(res);
        } else if (res.status == 'error') {
          this.logout();
          reject(res);
        }
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });


    return p;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
    console.log(resp.user);
    alert(resp.user.username + ", you are now logged in");
  }

  getUser() {
    return this._user;
  }

//Gets the chatID for a specified language
  getChatID(lang) {
    if (this._user) {
      return this._user["languages"][lang];
    }
    return false;
  }

  //returns the first language found in the langauges array for a certain user
  getFirstChatID() {
    var keys = Object.keys(this._user["languages"]);
    console.log(this._user["languages"][keys[0]]);
    return this._user["languages"][keys[0]];
  }

  getLanguages() {
    var keys = Object.keys(this._user["languages"]);
    return keys;
  }

  _isLoggedIn() {
    if (this._user) {
      console.log(this._user.username + " is logged in.");
      return true;
    }
    return false;
  }
}
