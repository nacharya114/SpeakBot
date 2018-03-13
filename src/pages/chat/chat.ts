import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { Message } from '../../models/message';
// import { Messages } from '../../providers/providers';
import { ChatbotInterfaceProvider } from '../../providers/chatbot-interface/chatbot-interface'

@IonicPage()
@Component({
  selector: 'chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  currentMessages: Message[];
  speechList: Array<string> = [];
  userInput: String = "";

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public chatbotInterface: ChatbotInterfaceProvider, private text2speech: TextToSpeech, private speech: SpeechRecognition) {
  //this.messages = this.getMessages();
  this.currentMessages = this.chatbotInterface.getChatMessages("");
  //this.getMessages();
  }

  async listenForSpeech():Promise<void>{
    try{
      const permission = await this.speech.hasPermission();
      console.log(permission);
      if(permission){
        //specified for english atm
        this.speech.startListening({"language": "en-EN"}).subscribe(
        data =>
          {this.speechList = data;
            this.userInput = this.speechList[0];
      }, error => console.log(error));
      }else{
        await this.speech.requestPermission();
      }
    }
    catch(e){}
  }

 sendMessage(message: String){
   //TODO: Add textbox clear after sending, 
   //and deactivation of send button for empty messages
   this.chatbotInterface.sendMessage(message, "");
 } //temporarily empty function

 getMessages() {
   //this.messages = ["hello how are you", "I am well, how are you", "good"];
  }

  playSpeech(event, message: Message) {
      this.text2speech.speak(message.content).catch( error => {});
  }

}
