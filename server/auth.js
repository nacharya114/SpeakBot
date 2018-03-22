var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');
// Initialize Firebase for the application
var config = {
    apiKey: process.env.firebaseApiKey,
    // authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    // storageBucket: process.env.storageBucket,
    // messagingSenderId: process.env.messagingSenderId
  };

var devConfig = {
  apiKey: "AIzaSyA7RUGumjatLW6RNqx9Za0fRb4eCdcKIcY",
  databaseURL: "https://speakbot-197821.firebaseio.com/"
}

firebase.initializeApp(devConfig);
var database = firebase.database();
var userTable = database.ref('users');

module.exports = {
  isValidUser: function(username, password) {


    var p = new Promise((resolve, reject) => {
      var userResults = userTable.orderByChild("username").equalTo(username);
      console.log("auth.js\\"+ "user results table:");
      userResults.once("value").then((data) => {
        console.log(data);
        isValid = data.forEach((user) => {
          if (user.child("password").exists()) {
            if (user.child("password").val() == password) {
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
  }
}
