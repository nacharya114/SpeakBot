import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Messages } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  message: any;

  constructor(public navCtrl: NavController, navParams: NavParams, messages: Messages) {
    this.message = navParams.get('message') || messages.defaultMessage;
  }

}
