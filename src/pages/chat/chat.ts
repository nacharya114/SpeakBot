import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { Message } from '../../models/message';
// import { Messages } from '../../providers/providers';
import { ChatbotInterfaceProvider } from '../../providers/chatbot-interface/chatbot-interface'
import { Content } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public chatbotInterface: ChatbotInterfaceProvider, private text2speech: TextToSpeech,
    private speech: SpeechRecognition, _zone: NgZone) {
  this._zone = _zone;
  this.currentMessages = this.chatbotInterface.getChatMessages();
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
 listen():Promise<String> {
   let p = new Promise<String>(resolve => {
     this.speech.startListening({"language": "en-EN"}).subscribe(data =>{
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
