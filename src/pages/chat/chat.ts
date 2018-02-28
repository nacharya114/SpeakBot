import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';

import { Message } from '../../models/message';
import { Messages } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  currentMessages: Message[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public messages: Messages, public talk: TextToSpeech) {
  //this.messages = this.getMessages();
  this.currentMessages = this.messages.query();
  //this.getMessages();
  }

 getMessages() {
   //this.messages = ["hello how are you", "I am well, how are you", "good"];
  }

  text2speech(message: Message) {
    this.talk.speak(message.content);
    console.log(message.content);
  }

}
