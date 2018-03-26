var firebase = require('./fbConnect');

var database = firebase.database();
var chatDB = database.ref('chats');
var users = database.ref('users');

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
  getMessages: function(chatID) {
    var p = new Promise((resolve, reject)=> {
      chatDB.child(chatID).orderByChild('interaction_count')
        .once('value').then((data) => {
          msglist = [];
          dataObj = Object.keys(data.val());
          for(var i = 0; i < dataObj.length; i++) {
            raw_data =data.val()[dataObj[i]];
            //TODO: Finish this later. need to return new MEssage(name, content)
            raw_data['name'] = raw_data['sender'];
            msglist.push(raw_data);
          }
          resolve(msglist);
        });

      //Forget about this until translation is done
    });
    return p;
  }
}
