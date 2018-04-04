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
  messages: Array<Message> = [];
  chatID: String;
  chatState: String;

  constructor(public http: HttpClient, public api: Api, private user: User) {
    console.log('Hello ChatbotInterfaceProvider Provider');
    this.getChatMessages(this.user.getLanguages()[0]).then((msg)=> {
      console.log("Got messages");
    },
    () => {
      console.log("Error, couldnt get messages");
    });
  }

  getChatMessages(lang){
    var p = new Promise<Message[]>((resolve, reject) => {
      this.messages = [];
      //This uses the requested langauge to fetch the appropriate chatID from the user

      var params = {
        chatID: this.user.getUser()["languages"][lang]
      }
      console.log(params);
      this.api.get(this.endpoint, params).subscribe((data) => {
        console.log(data);
        for (let msg in data["messages"]) {
          console.log(msg);
          this.messages.push(new Message(data["messages"][msg]));
        }
        resolve(this.messages);
      });
    });
    return p;
  }

  sendMessage(msgStr: String, chatState: String): Promise<Message> {
    this.messages.push(this.createUserReply(msgStr));
    console.log("Geting message");
    let p = new Promise((resolve) =>{
      var params = {"input": msgStr,
            "cs": chatState};
      if (this.user._isLoggedIn()) {
        params['userID'] = this.user.getUser()['userID'];
      }
      console.log(params);
      //TODO: Find out why messages aren't saving by comparing REST parameters.
      this.api.post(this.endpoint, params).subscribe((data) => {
                                      this.chatState = data["cs"];
                                      if (this.chatID == null) {
                                        this.chatID = data['chatID'];
                                      }
                                      resolve(this.createCleverbotReply(data["output"]));
                                    });
    });
    return p;
  }

  hasChatId():boolean {
    return (this.chatID ? true : false);
  }

  getChatId():String {
    return this.user.getUser()['chatID'];
  }
  private createCleverbotReply(message: String): Message{
    return this.createReply("Cleverbot", message);
  }

  private createUserReply(message: String):Message {
    return this.createReply("User", message);
  }

  private createReply(name: String, content: String):Message {
    return new Message({"name": name,
            "content": content});
  }

}
