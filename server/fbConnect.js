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

module.exports = firebase;
