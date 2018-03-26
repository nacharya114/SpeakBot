var firebase = require('./fbConnect');
var database = firebase.database();
var userTable = database.ref('users');

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
  addUser: function(username, pass) {
    var newUserId = userTable.push().key;
    console.log("New User ID created.");
    var userData = {
      "username": username,
      "password": pass,
      "userID": newUserId
    }
    userTable.child(newUserId).set(userData);
    return userData;
  },
  updateChatState: function(userID, cs) {
    userTable.child(userID).child("chatState").set(cs);
  },
  updateChatID: function(userID, chatID) {
    userTable.child(userID).child("chatID").set(chatID);
  }
}
