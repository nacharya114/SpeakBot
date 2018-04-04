var firebase = require('./fbConnect');
var database = firebase.database();
var userTable = database.ref('users');
var chatTable = database.ref('chats');

var prime = require('./prime');

module.exports = {
  isValidUser: function(username, password) {


    var p = new Promise((resolve, reject) => {
      var userResults = userTable.orderByChild("username").equalTo(username);
      console.log("auth.js\\"+ "user results table:");
      userResults.once("value").then((data) => {
        isValid = data.forEach((user) => {
          if (user.child("password").exists()) {
            if (user.child("password").val() == password) {
              console.log(user.val());
              resolve(user.val());
              return true;
            }
          }
        });
        if (!isValid) {
          reject();
        }
      });
    });
    return p;
  },
  addUser: function(account) {
    var p = new Promise((resolve, reject) => {
      prime.getNewChat(account['language']).then((res) => {
        var newUserId = userTable.push().key;
        console.log("New User ID created.");

        //Creating new account variable to be saved to firebase and sent back to user
        var ret_account = {
          "username": account.username,
          "password": account.password,
          "userID": newUserId,
          "languages": {}
        }
        ret_account["languages"][account['language']] = res.conversation_id;

        first_msg = {
          "content": res.output,
          "chatState": res.cs,
          "name": "Cleverbot"
        };
        chat_data = {
          "language": account["language"],
          "userID":  newUserId,
          "chatState": res.cs,
          "messages": [first_msg]
        };
        console.log(ret_account);

        chatTable.child(res.conversation_id).set(chat_data);
        userTable.child(newUserId).set(ret_account);
        resolve(ret_account);
      });
    });
    return p;
  },
  updateChatState: function(userID, cs) {
    userTable.child(userID).child("chatState").set(cs);
  },
  updateChatID: function(userID, chatID) {
    userTable.child(userID).child("chatID").set(chatID);
  },
  addLang: function(userID, lang){
    var p = new Promise((resolve, reject) => {
      userTable.child(userID).child("languages").once("value").then((data) => {
        var language_list = data.val(); // get the current list of language_list
        prime.getNewChat(lang).then((res) => {
          language_list[lang] = res.conversation_id;


          first_msg = {
            "content": res.output,
            "chatState": res.cs,
            "name": "Cleverbot"
          };
          chat_data = {
            "language": lang,
            "userID":  userID,
            "chatState": res.cs,
            "messages": [first_msg]
          };
          chatTable.child(res.conversation_id).set(chat_data);
          userTable.child(userID).child("languages").set(language_list);
          resolve(language_list);
        });
      });
    });
    return p;
  }
}
