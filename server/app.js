var express = require('express');
var path = require('path');
var app = express();
var bodyparser =require('body-parser');

const Cleverbot = require('cleverbot');
var cbot = new Cleverbot({key: "CC8hy0Bny7N8DtVbWrw3EYKGSIQ"});

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
  chatState = req.body.cs;
  userId = req.body.userID;
  console.log(input);
  console.log(chatState);
  console.log(userId);

  if (input) {
    // res.send("Your input was:" + input);

    cbot.query(input, {
      cs: chatState
    }).then((cres) =>{
      var cObj = { 'output': cres.output,
                   'cs'    : cres.cs,
                    'chatID': cres.conversation_id };
      if (userId) {
          chatDB.saveMessage(cres.conversation_id, userId, input, cres.output);
          if (!chatState) {
            auth.updateChatState(userId, cres.cs);
            //auth.updateChatID(userId, cres.conversation_id);
          }
      }
      res.json(cObj);
    });
  } else {
    res.send("err");
  }
});

app.get('/chatbot', (req, res) => {
  chatID = req.query.chatID;
  target_lang = req.query.lang;
  if (!chatID) {
    res.send({"status": "error"});
    return;
  }
  if (!target_lang) {
    target_lang = "en";
  }
    chatDB.getMessages(chatID, target_lang).then((msgs) => {
      res.send({
        "status": "success",
        "messages": msgs
      });
    });

});

app.get('/chatbot/:lang', (req,res)=> {

});

app.post('/login', (req, res)=> {
  //TODO: Create a user database in firebase/GCP/
    var account = req.body;

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
    var newAccount = req.body;
    console.log(newAccount);
    // res.send(newAccount);
    var user = auth.addUser(newAccount.username, newAccount.password);
    res.send({"status": "success",
              "user": user});
});



app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
