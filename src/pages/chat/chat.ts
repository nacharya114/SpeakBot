import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, ModalController, NavController, ActionSheetController } from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { Message } from '../../models/message';
// import { Messages } from '../../providers/providers';
import { ChatbotInterfaceProvider } from '../../providers/chatbot-interface/chatbot-interface'
import { Content } from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  _zone: any;
  currentMessages: Message[];
  speechList: Array<string> = [];
  userInput: String = "";
  chatId: String = "";
  currentLanguage = {
    language: "en",
    locale:  "en-EN"
  };

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public chatbotInterface: ChatbotInterfaceProvider, private text2speech: TextToSpeech,
    private speech: SpeechRecognition, _zone: NgZone, public lsActionSheet: ActionSheetController,
    private pageTrans:NativePageTransitions) {
  this._zone = _zone;
  this.currentMessages = this.chatbotInterface.getChatMessages();
  }
  presentLanguageActionSheet() {
    let actionSheet = this.lsActionSheet.create({
      title: 'Select a Language',
      buttons: [
        {
          text: 'English',
          handler: () => {
            console.log('English clicked');
            this.currentLanguage.language = "en";
            this.currentLanguage.locale = "en-EN";
            alert("Language Changed to English");
          }
        },
        {
          text: 'Français',
          handler: () => {
            console.log('French clicked');
            this.currentLanguage.language = "fr";
            this.currentLanguage.locale = "fr-FR";
            alert("Language Changed to French");
          }
        },
        {
          text: 'Deutsch',
          handler: () => {
            console.log('German clicked');
            this.currentLanguage.language = "de";
            this.currentLanguage.locale = "de-DE";
            alert("Language Changed to German");
          }
        }
      ]
    });
    actionSheet.present();
  }
  backToLogin(){
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
    }
    this.pageTrans.slide(options);
    this.navCtrl.setRoot('LoginPage');
  }
 listen():Promise<String> {
   let p = new Promise<String>(resolve => {
     this.speech.startListening({"language": this.currentLanguage.locale}).subscribe(data =>{
        resolve(data[0]);
     });
   });
   return p;
 }
 ionViewDidEnter(){ //adding these too in an attempt to add auto scrolling -g 3/20
     this.content.scrollToBottom(300);//300ms animation speed
 }
 scrollToBottom(){
         setTimeout(() => {
             this.content.scrollToBottom();
         });
 }

 sendMessage(){
   this._zone.run(() => {
     this.listen().then(msg => {
       this.chatbotInterface.sendMessage(msg,this.chatId)
        .then((message)=> {
          this.currentMessages.push(message);
          this.chatId = this.chatbotInterface.getChatId();
          this.scrollToBottom();
          this.text2speech.speak({ text: message.content, locale: this.currentLanguage.locale }).catch(error => {});
        });
     });
   });
 } //temporarily empty function */

 send(){
   this.hasPermission()
    .then(data =>{
      if (data) {
        this.sendMessage();
      } else {
        this.getPermission()
        .then(() => {
          this.sendMessage();
        });
      }
    });
 }

 async hasPermission():Promise<boolean> {
   try {
     const permission = await this.speech.hasPermission();
     return permission;
   } catch(e) {
     alert(e);
   }
 }

 async getPermission():Promise<void> {
   try {
     const perm = await this.speech.requestPermission();
     return perm;
   } catch(e) {

   }
 }

 getMessages() {
   //this.messages = ["hello how are you", "I am well, how are you", "good"];
  }

  playSpeech(event, message: Message) {
      this.text2speech.speak({ text: message.content, locale: this.currentLanguage.locale }).catch( error => {});
  }
}
