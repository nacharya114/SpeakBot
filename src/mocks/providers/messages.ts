import { Injectable } from '@angular/core';

import { Message } from '../../models/message';

@Injectable()
export class Messages {
  messages: Message[] = [];

  defaultMessage: any = {
    "name": "CleverBot",
    "content": "Hello!",
  };


  constructor() {

    //        "name": "Paul Puppy",
    //        "profilePic": "assets/img/speakers/puppy.jpg",
    //        "about": "Paul is a Puppy."
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

    for (let message of messages) {
      this.messages.push(new Message(message));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.messages;
    }

    return this.messages.filter((message) => {
      for (let key in params) {
        let field = message[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return message;
        } else if (field == params[key]) {
          return message;
        }
      }
      return null;
    });
  }

  add(message: Message) {
    this.messages.push(message);
  }

  delete(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }
}
