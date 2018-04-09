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
import { Platform } from 'ionic-angular';
import { TranslationsProvider } from '../../providers/translations/translations';
//import { SpeechRecognitionPlugin } from

declare var responsiveVoice: any;

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
  recording = false;
  isIOS = false;


  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public chatbotInterface: ChatbotInterfaceProvider, private text2speech: TextToSpeech,
    private speech: SpeechRecognition, _zone: NgZone, public lsActionSheet: ActionSheetController,
    private pageTrans:NativePageTransitions, private user: User, public plt: Platform,
    private transProvider: TranslationsProvider) {
    this._zone = _zone;
    this.currentLanguage = this.user.getLanguages()[0];
    this.chatbotInterface.getChatMessages(this.currentLanguage).then((data) => {
      this.currentMessages = data;
      this.playSpeech(null, this.currentMessages[this.currentMessages.length - 1]);
      this.content.scrollToBottom();
    });
    if(this.plt.is('ios')){
      this.isIOS = true;
    }

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
              "German":"de-DE",
              "Spanish":"es-MX"};
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
           this.playSpeech(null, this.currentMessages[this.currentMessages.length -1]);
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
     if(this.isIOS){
       this.recording = true;
     }

   });
   return p;
 }
 ionViewDidEnter(){ //adding these too in an attempt to add auto scrolling -g 3/20
     this.content.scrollToBottom(300);//300ms animation speed
 }

 ionViewWillEnter() {
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
          console.log("before speech plays");
          this.playSpeech(null, message);
          console.log("after");
          this.scrollToBottom();
        });
     });
   });
 }

 send(){
   this.hasPermission()
    .then(data =>{
      if (data) {
        if(!this.recording || !this.isIOS){
        this.sendMessage();
      }else{
        this.speech.stopListening();
        this.recording = false;
      }
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
     alert("hasPermission error");
     alert(e);
   }
 }

 async getPermission():Promise<void> {
   try {
     const perm = await this.speech.requestPermission();
     return perm;
   } catch(e) {
     alert("getPermission error");
     alert(e);
   }
 }

  playSpeech(event, message: Message) {
    // TODO: add speed option
     if (!message['speed']) {
       message.speed = 1;
     }
     var map = {
       "fr-FR": "French Female",
       "de-DE": "Deutsch Female",
       "en-US": "US English Female"
       "es-MX": "Spanish Latin American Female"
     };
     var adjusted = (message.speed ? 1 : 0.5);
     console.log("playSpeech():" + adjusted);
     responsiveVoice.speak(message.content, map[this.currentLanguage], {rate: adjusted, volume: 1});
     message.speed++;
     message.speed %= 2;
      // this.text2speech.speak({text: message.content, locale: this.currentLanguage, rate: 1}).catch( error => {});
  }

  translate(message) {
    if (message['isTranslated']) {
      message['isTranslated'] = false;
    } else if (message['translation']){
      message['isTranslated'] = true;
      this.playSpeech(null, message);
    } else {
      if (!(this.currentLanguage == this.user.getUser().nativeLanguage)) {
        this._zone.run(() => {
          this.transProvider.translateMessage(message.content, this.currentLanguage).then((translation) => {
            message['translation'] = translation;
            message['isTranslated'] = true;
          });
        });
      }
      this.playSpeech(null, message);
    }
  }


  revertConversation(message) {
    console.log("chat.ts\\ in revertConversation()");
    alert("Still here");
  }
}
