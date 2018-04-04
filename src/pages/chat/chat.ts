import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, ModalController, NavController, ActionSheetController } from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { Message } from '../../models/message';
// import { Messages } from '../../providers/providers';
import { ChatbotInterfaceProvider } from '../../providers/chatbot-interface/chatbot-interface'
import { Content } from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import { User } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  _zone: any;
  currentMessages: Array<Message>;
  speechList: Array<string> = [];
  userInput: String = "";
  chatId: String = "";
  currentLanguage = "";

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public chatbotInterface: ChatbotInterfaceProvider, private text2speech: TextToSpeech,
    private speech: SpeechRecognition, _zone: NgZone, public lsActionSheet: ActionSheetController,
    private pageTrans:NativePageTransitions, private user: User) {
  this._zone = _zone;
  this.currentLanguage = this.user.getLanguages()[0];
  this.chatbotInterface.getChatMessages(this.currentLanguage).then((data) => {
    this.currentMessages = data;
  });
  }

  presentLanguageActionSheet() {
    var languages = this.user.getLanguages();
    var map = {"en-US": "English",
              "fr-FR": "French",
              "de-DE":"German"};
    let buttonArr = [];
    for(let lang of languages){
      var button = {text: map[lang],
        handler: () => {
          this.currentLanguage = lang;
          this.changeChatLanguage();
        }};
        buttonArr.push(button)
      }

    let actionSheet = this.lsActionSheet.create({
      title: 'Select a Language',
      buttons: buttonArr
    });
    actionSheet.present();
  }

  addLanguageActionSheet() {
    var languages = ["English", "French", "German"];
    var map = {"English": "en-US",
              "French": "fr-FR",
              "German":"de-DE"};
    let buttonArr = [];
    for(let lang of languages){
      var button = {text: lang,
        handler: () => {
          this.user.addlang(map[lang]).then((res) => {
            this.currentLanguage = map[lang];
            this.changeChatLanguage(); //updates the screen
          })
        }};
        buttonArr.push(button)
      }

    let actionSheet = this.lsActionSheet.create({
      title: 'Select a Language to add:',
      buttons: buttonArr
    });
    actionSheet.present();
  }

// replace at buttons:
  // [
  //   {
  //     text: 'English',
  //     handler: () => {
  //       console.log('English clicked');
  //       this.currentLanguage = {
  //         "language": "en",
  //         "locale": "en-US"
  //       };
  //       this.changeChatLanguage();
  //     }
  //   },
  //   {
  //     text: 'Francais',
  //     handler: () => {
  //       console.log('Francais clicked');
  //       this.currentLanguage.language = "fr";
  //       this.currentLanguage.locale = "fr-FR";
  //       this.changeChatLanguage();
  //     }
  //   },
  //   {
  //     text: 'Language 3',
  //     handler: () => {
  //       console.log('Button 3 clicked');
  //     }
  //   }
  // ]

  changeChatLanguage() {
    this._zone.run(() => {
      this.chatbotInterface.getChatMessages(this.currentLanguage)
        .then((msgs) => {
          console.log("Changed language:");
          console.log(msgs);
           this.currentMessages = msgs;
        });
    });
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
     this.speech.startListening({"language": this.currentLanguage}).subscribe(data =>{
        resolve(data[0]);
     });
   });
   return p;
 }
 ionViewDidEnter(){ //adding these too in an attempt to add auto scrolling -g 3/20
     this.content.scrollToBottom(300);//300ms animation speed
 }

 ionViewWillEnter() {
   console.log("Will enter chat.ts");
   this.chatbotInterface.getChatMessages(this.currentLanguage).then((msgs) => {
     this.currentMessages = msgs;
     console.log("chat.ts\\ " + this.currentMessages);
   });
 }
 scrollToBottom(){
         setTimeout(() => {
             this.content.scrollToBottom();
         });
 }

 sendMessage(){
   this._zone.run(() => {
     this.listen().then(msg => {
       this.chatbotInterface.sendMessage(msg,this.currentMessages[this.currentMessages.length -1]["chatState"], this.currentLanguage)
        .then((message)=> {
          this.currentMessages.push(message);
          this.chatId = this.chatbotInterface.getChatId();
          this.scrollToBottom();
          this.text2speech.speak(message.content).catch(error => {});
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

  playSpeech(event, message: Message) {
    // TODO: add speed option
     console.log(this.currentLanguage);
      this.text2speech.speak({text: message.content, locale: this.currentLanguage}).catch( error => {});
  }
}
