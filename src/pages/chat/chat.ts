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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public messages: Messages, private text2speech: TextToSpeech) {
  //this.messages = this.getMessages();
  this.currentMessages = this.messages.query();
  //this.getMessages();
  }

 getMessages() {
   //this.messages = ["hello how are you", "I am well, how are you", "good"];
  }

  playSpeech(event, message: Message) {
      this.text2speech.speak(message.content);
  }

}
