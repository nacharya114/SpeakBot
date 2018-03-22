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

firebase.initializeApp(config);
var database = firebase.database();
var userTable = database.ref('users');

module.exports = {
  isValidUser: function(username, password) {
    var userResults = userTable.orderByChild("username").equalTo(username);
    console.log("auth.js\\"+ "user results table:");
    console.log(userResults);
    if (!userResults) {
      return false;
    }
    for (user in userResults) {
      if (user["password"] == password) {
        return user;
      }
    }
    return false;
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
