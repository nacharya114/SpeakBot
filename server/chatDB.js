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
            console.log(msglist[Object.keys(msglist)[0]]);
            ic = ic['interaction_count'];
            message['interaction_count'] = ic + 1;
          }
          newmsg = chatDB.child(chatID).push().key;
          message['msgID'] = newmsg;
          chatDB.child(chatID).child(newmsg).set(message);

          message['sender'] = "Cleverbot";
          message['interaction_count'] += 1;
          newmsg = chatDB.child(chatID).push().key;
          message['msgID'] = newmsg;
          message['content'] = response;
          chatDB.child(chatID).child(newmsg).set(message);
        });
    }
  },
  getMessages: function(chatID, target) {
    var p = new Promise((resolve, reject)=> {
      chatDB.child(chatID).orderByChild('interaction_count')
        .once('value').then((data) => {
          msglist = [];
          dataObj = Object.keys(data.val());
          for(var i = 0; i < dataObj.length; i++) {
            raw_data =data.val()[dataObj[i]];
            //TODO: Finish this later. need to return new MEssage(name, content)
            raw_data['name'] = raw_data['sender'];
            if (target) {
              translate.translate(raw_data['content'], target)
                .then((data) => {
                  var translation = data[0];
                  raw_data['content'] = translation;
                  msglist.push(raw_data);
                });
            } else {
              msglist.push(raw_data)
            }            
          }
          resolve(msglist);
        });

      //Forget about this until translation is done
    });
    return p;
  }
}
