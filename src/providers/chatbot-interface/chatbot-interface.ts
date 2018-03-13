import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Message } from '../../models/message'

/*
  Generated class for the ChatbotInterfaceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatbotInterfaceProvider {
  endpoint = "chatbot";
  messages: Message[];


  constructor(public http: HttpClient, api: Api) {
    console.log('Hello ChatbotInterfaceProvider Provider');
    let messages = [
      {
        "name": "CleverBot",
        "content": "Hello!",
      },
      {
        "name": "User",
        "content": "Hello!",
      },
      {
        "name": "CleverBot",
        "content": "How are you today!",
      },
      {
        "name": "User",
        "content": "Great! How are you",
      },
      {
        "name": "CleverBot",
        "content": "Fine",
      },
      {
        "name": "User",
        "content": "What is the weather today",
      }
    ];
  }

  getChatMessages(chatId: String){
    return this.messages;
  }

  sendMessage(message: String, chatId: String) {
    let newmsg = {"name": "User",
                  "content": message};
    this.messages.push(new Message(newmsg));
  }

}
