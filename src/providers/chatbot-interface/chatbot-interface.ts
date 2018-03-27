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
    this.getChatMessages().then((msg)=> {
      console.log("Got messages");
    },
  ()=> {
    console.log("Error, couldnt get messages");
  });
    // this.getChatMessages().then((msglist)=> {
    //   this.messages = msglist;
    // },
    // ()=>{
    //   this.messages = [];
    // });
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
  }

  getChatMessages(){
    var p = new Promise<Message[]>((resolve, reject) => {
      if (this.user._isLoggedIn()) {
        console.log("User ID:" + this.user.getUser()['chatID']);
        var params = {
          "chatID": this.user.getUser()["chatID"]
        };
        this.api.get(this.endpoint, params).subscribe((data)=> {
          // let msg: any;
        console.log(data);
        this.messages = [];
        for (let msg of data["messages"]) {
          console.log(msg);
          this.messages.push(this.createReply(msg['name'], msg['content'], ""));
        }
          resolve(this.messages);
          console.log("Message list recieved");
          console.log(this.messages);
        });
      } else {
        console.log("Message promise rejected");
        reject();
      }
    });
    return p;
  }

  sendMessage(msgStr: String, chatState: String): Promise<Message> {
    this.messages.push(this.createUserReply(msgStr, ""));
    console.log("Geting message");
    let p = new Promise((resolve) =>{
      var params = {"input": msgStr,
            "cs": chatState};
      if (this.user._isLoggedIn()) {
        params['userID'] = this.user.getUser()['userID'];
      }
      this.api.post(this.endpoint, params).subscribe((data) => {
                                      this.chatState = data["cs"];
                                      if (this.chatID == null) {
                                        this.chatID = data['chatID'];
                                      }
                                      resolve(this.createCleverbotReply(data["output"], this.chatState));
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
  private createCleverbotReply(message: String, chatID:String): Message{
    return this.createReply("CleverBot", message, chatID);
  }

  private createUserReply(message: String, chatID:String):Message {
    return this.createReply("User", message, chatID);
  }

  private createReply(name: String, content: String, chatID:String):Message {
    return new Message({"name": name,
            "content": content});
  }

}
