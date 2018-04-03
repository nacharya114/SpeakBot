var firebase = require('./fbConnect');

var database = firebase.database();
var chatDB = database.ref('chats');
var users = database.ref('users');

const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'speakbot-197821';

// Instantiates a client
const translate = new Translate({
  'projectId': projectId,
});


module.exports = {
  saveMessage: function(chatID, userID, content, response) {
    message = {
      "sender": "User",
      "chatID": chatID,
      "userID": userID,
      "content": content,
      "interaction_count": 0
    };
    if (chatID) {
      chatDB.child(chatID).orderByChild('interaction_count').limitToLast(1)
        .once('value').then((data) => {
          console.log(data.val());
          // console.log('data.exists: ' + data.exists());
          if (!data.exists()) {
            message['interaction_count'] = 0;
          } else {
            msglist = data.val();
            ic = msglist[Object.keys(msglist)[0]];
            ic = ic['interaction_count'];
            message['interaction_count'] = ic + 1;
          }
          newmsg = chatDB.child(chatID).push().key;
          message['msgID'] = newmsg;
          console.log("Saving message:");
          console.log(message);
          chatDB.child(chatID).child(newmsg).set(message);

          message['sender'] = "Cleverbot";
          message['interaction_count'] += 1;
          newmsg = chatDB.child(chatID).push().key;
          message['msgID'] = newmsg;
          message['content'] = response;
          console.log("Saving message:");
          console.log(message);
          chatDB.child(chatID).child(newmsg).set(message);
        });
    }
  },
  //Gets the messages for a particular chat
  //@param chatID chatID for a specific chat
  getMessages: function(chatID) {
    var p = new Promise((resolve, reject) => {
      chatDB.child(chatID).child("messages")
        .once('value').then((data) => {
          console.log(data.val());
          resolve(data.val());
        });

    });

    return p;
  },
  getChatState: function(chatID) {
    var p = new Promise((resolve, reject) => {
      chatDB.child(chatID).child("chatState")
        .once('value').then((data) => {
          console.log(data.val());
          resolve(data.val());
        });

    });

    return p;
  }

}

//OLD CODE FOR TRANSLATIONS:
// var p = new Promise((resolve, reject)=> {
//   chatDB.child(chatID).orderByChild('interaction_count')
//     .once('value').then((data) => {
//       msglist = [];
//       dataObj = Object.keys(data.val());
//       for(var i = 0; i < dataObj.length; i++) {
//         raw_data =data.val()[dataObj[i]];
//         //TODO: Finish this later. need to return new MEssage(name, content)
//         raw_data['name'] = raw_data['sender'];
//         msglist.push(raw_data);
//       }
//       final_list = [];
//       console.log("Got messages, now translating");
//       indexSize = 0;
//       msglist.forEach(function(message, index) {
//         translate.translate(message['content'], target).then((result) => {
//           console.log("Translation done for message#" + index);
//           var translation = result[0];
//           message['content'] = translation;
//           final_list[index] = message;
//           indexSize++;
//           if (indexSize == msglist.length && !(final_list.includes(null))) {
//             console.log("Finished translations");
//             console.log(final_list);
//             resolve(final_list);
//           }
//         }, (err) => {
//           console.log(err);
//         });
//       });
//     });
//
//   //Forget about this until translation is done
// });
// return p;
