import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string, language: string } = {
    username: 'Example',
    password: 'test',
    language: 'English'
  };


  // Our translated text strings
  private loginErrorString: string;
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private pageTrans:NativePageTransitions) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;

    });
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });
  }

  slideToChat(){
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
    }
    this.pageTrans.slide(options);
    this.navCtrl.setRoot('ChatPage');
  }

  // Attempt to login in through our User service
  //TODO: Change login to use promise so I can control login rejection
  doLogin() {
    this.user.login(this.account).then((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: "Login Failed", //this.loginErrorString
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

//TODO: Change signup to use promise so I can control signup rejection
  doSignup() {
    // Attempt to login in through our User service
    // this.user.signup(this.account).then((resp) => {
    //   console.log(resp);
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //
    //   //this.navCtrl.push(MainPage);
    //   console.log(err);
    //   // Unable to sign up
    //   let toast = this.toastCtrl.create({
    //   //TODO: if not fixed, use old code
    //     message: "Sign up failed", //this.signupErrorString
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
    this.navCtrl.push('SignupPage');
  }

}
