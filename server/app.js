var express = require('express');
var path = require('path');
var app = express();
var bodyparser =require('body-parser');
var request = require('request');

const Cleverbot = require('cleverbot');
var cbot = new Cleverbot({key: "CC8hy0Bny7N8DtVbWrw3EYKGSIQ"});

const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'speakbot-197821';

// Instantiates a client
const translate = new Translate({
  'projectId': projectId,
});

var auth = require('./auth');
var chatDB = require('./chatDB');

var port = process.env.PORT || 3000;


// ************ USE BELOW WHEN HAVE USERNAME COLLECTION *****************


// app.use('/',express.static(path.resolve(__dirname,'../www')));
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	// console.log(req.method,req.path,req.body);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) =>{
  res.send("hello");
});

/*this ignores conversation history
and just sends each message as a new conversation */
app.post('/chatbot', (req,res) => {

  input = req.body.input;
  chatID = req.body.chatID;
  chatState = req.body.chatState;

  if (input) {

    cbot.query(input, {
      cs: chatState
    }).then((cres) => {
      console.log("Cleverbot res:");
      console.log(cres);
        cObj = {
          "content": cres.output,
          "name": "Cleverbot",
          "chatState": cres.cs
        };
        chatDB.saveMessage(input, cres.output, chatState, cres.cs, chatID);
        res.send(cObj);
    })
  }






  // chatState = req.body.cs;
  // userId = req.body.userID;
  // console.log(input);
  // console.log(chatState);
  // console.log(userId);

  //TODO: have conversations primed (make prime.js or .json with url) :
//  https://www.cleverbot.com/getreply?key=CC8hy0Bny7N8DtVbWrw3EYKGSIQ&input=Posez-moi une question&vtext2=Bonjour&vtext3=Bonjour, cleverbot

  // if (input) {
  //   // res.send("Your input was:" + input);
  //
  //   cbot.query(input, {
  //     cs: chatState
  //   }).then((cres) =>{
  //     var cObj = { 'output': cres.output,
  //                  'cs'    : cres.cs,
  //                   'chatID': cres.conversation_id };
  //     if (userId) {
  //         chatDB.saveMessage(cres.conversation_id, userId, input, cres.output);
  //         if (!chatState) {
  //           auth.updateChatState(userId, cres.cs);
  //           //auth.updateChatID(userId, cres.conversation_id);
  //         }
  //     }
  //     res.json(cObj);
  //   });
  // } else {
  //   res.send("err");
  // }
});

app.get('/chatbot', (req, res) => {
  chatID = req.query.chatID;
  if (!chatID) {
    res.send({"status": "error"});
    return;
  }
    chatDB.getMessages(chatID).then((msgs) => {
      res.send({
        "status": "success",
        "messages": msgs
      });
    });

});

app.post('/login', (req, res)=> {
  //TODO: Create a user database in firebase/GCP/
    var account = req.body;
    console.log(account);

    if (account) {
        auth.isValidUser(account.username, account.password)
          .then((user) => {
            console.log(user);
            res.send({"status": "success",
                      "user": user});
          },
          //TODO: Give more detail for error messages
          (err) =>{
              res.send({
                "status": "error",
                "detail": "User not found"
              });
          });
    }
});

app.post('/signup', (req, res)=> {
    var account = req.body;
    console.log(account);
    var user = auth.addUser(account).then((user) => {
      res.send({"status": "success",
                "user": user});
    });
});

app.post('/addlang', (req, res)=> {
    var lang = req.body.language;
    var userID = req.body.userID;
    console.log("the user requested to add langauge:");
    console.log(lang);
    var user = auth.addLang(userID, lang).then((langs) => {
      res.send({"status": "success",
                "languages": langs});
    });
});

app.get('/translate', (req, res) => {
  var target = req.query.target;
  var content = req.query.content;
  var source = req.query.source;

  target = target.substr(0,2);
  source = source.substr(0,2);

  console.log("Translating request:" + content + " to language: " + target + ", from: " + source);

    // translate.translate(content, target).then ((data) => {
    //   var translation = data[0];
    //   res.send({'translation': translation});
    // });

    var form = {
      "q": content,
      "target": target,
      "source": source,
      "format": 'text',
      "key": "AIzaSyBz3CzW9iqanvJkedIWAZtxJ84Xai3vqIw"
    };

    request.post({
      url: "https://translation.googleapis.com/language/translate/v2",
      form: form
    }, function(err, resp, body) {
      console.log(err,JSON.parse(body));
      var results = JSON.parse(body);
      console.log(results.data.translations[0].translatedText);
      res.send({translation: results.data.translations[0].translatedText});
    });
});



app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
