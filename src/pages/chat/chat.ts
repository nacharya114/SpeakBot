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
  currentLanguage: "en-EN";

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public chatbotInterface: ChatbotInterfaceProvider, private text2speech: TextToSpeech,
    private speech: SpeechRecognition, _zone: NgZone, public lsActionSheet: ActionSheetController,
    private pageTrans:NativePageTransitions) {
  this._zone = _zone;
  this.chatbotInterface.getChatMessages().then((data) => {
    this.currentMessages = data;
  });
  }

  // listenForSpeech() {
  //   try{
  //     const permission = await this.speech.hasPermission();
  //     console.log(permission);
  //     if(permission){
  //       //specified for english atm
  //       this.speech.startListening({"language": "en-EN"}).subscribe(
  //       data =>
  //         {this.speechList = data;
  //           this.userInput = this.speechList[0];
  //           this.chatbotInterface.sendMessage(this.userInput, this.chatId)
  //           .then((data) => {
  //             this.currentMessages.push(data);
  //           });
  //           if ((!this.chatId.length) && this.chatbotInterface.hasChatId()){
  //             this.chatId = this.chatbotInterface.getChatId();
  //           }
  //           this.bottomScroll();
  //     }, error => console.log(error));
  //     }else{
  //       this.speech.requestPermission();
  //     }
  //   }
  //   catch(e){}
  //
  // }
  presentLanguageActionSheet() {
    let actionSheet = this.lsActionSheet.create({
      title: 'Select a Language',
      buttons: [
        {
          text: 'English',
          handler: () => {
            console.log('English clicked');
            this.currentLanguage = "en-EN";
            alert("Language Changed to English");
          }
        },
        {
          text: 'Language 2',
          handler: () => {
            console.log('Button 2 clicked');
          }
        },
        {
          text: 'Language 3',
          handler: () => {
            console.log('Button 3 clicked');
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
   this.chatbotInterface.getChatMessages().then((msgs) => {
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
       this.chatbotInterface.sendMessage(msg,this.chatId)
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

 getMessages() {
   //this.messages = ["hello how are you", "I am well, how are you", "good"];
  }

  playSpeech(event, message: Message) {
      this.text2speech.speak(message.content).catch( error => {});
  }
}
