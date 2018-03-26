import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Message } from '../../models/message';
import { User } from '../user/user';

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


  constructor(public http: HttpClient, public api: Api, private user: User) {
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
    this.messages.push(this.createUserReply(msgStr, ""));
    console.log("Geting message");
    let p = new Promise((resolve) =>{
      var params = {"input": msgStr,
            "cs": chatId};
      if (this.user._isLoggedIn()) {
        params['userID'] = this.user.getUser()['userID'];
      }
      this.api.post(this.endpoint, params).subscribe((data) => {
                                      console.log("Testing api get");
                                      this.chatId = data["cs"];
                                      resolve(this.createCleverbotReply(data["output"], this.chatId));
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
  private createCleverbotReply(message: String, chatId:String): Message{
    return this.createReply("CleverBot", message, chatId);
  }

  private createUserReply(message: String, chatId:String):Message {
    return this.createReply("User", message, chatId);
  }

  private createReply(name: String, content: String, chatId:String):Message {
    return new Message({"name": name,
            "content": content});
  }

}
