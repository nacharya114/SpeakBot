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
  chatId: String;


  constructor(public http: HttpClient, public api: Api) {
    console.log('Hello ChatbotInterfaceProvider Provider');
    this.messages = [
      // {
      //   "name": "CleverBot",
      //   "content": "Hello!",
      // },
      // {
      //   "name": "User",
      //   "content": "Hello!",
      // },
      // {
      //   "name": "CleverBot",
      //   "content": "How are you today!",
      // },
      // {
      //   "name": "User",
      //   "content": "Great! How are you",
      // },
      // {
      //   "name": "CleverBot",
      //   "content": "Fine",
      // },
      // {
      //   "name": "User",
      //   "content": "What is the weather today",
      // }
    ];
  }

  getChatMessages(){
    return this.messages;
  }

  sendMessage(msgStr: String, chatId: String): Promise<Message> {
    this.messages.push(this.createUserReply(msgStr));
    console.log("Geting message");
    let p = new Promise((resolve) =>{
      this.api.get(this.endpoint, {"input": msgStr,
                                    "cs": chatId}).subscribe((data) => {
                                      console.log("Testing api get");
                                      this.chatId = data["cs"];
                                      resolve(this.createCleverbotReply(data["output"]));
                                    });
    });
    return p;
  }

  hasChatId():boolean {
    return (this.chatId ? true : false);
  }

  getChatId():String {
    return this.chatId;
  }
  private createCleverbotReply(message: String): Message{
    return this.createReply("CleverBot", message);
  }

  private createUserReply(message: String):Message {
    return this.createReply("User", message);
  }

  private createReply(name: String, content: String):Message {
    return new Message({"name": name,
            "content": content});
  }

}
