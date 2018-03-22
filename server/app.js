var express = require('express');
var path = require('path');
var app = express();
var bodyparser =require('body-parser');

const Cleverbot = require('cleverbot');
var cbot = new Cleverbot({key: "CC7i1plOP5-fomRyfjyWM33QSkg"});

var auth = require('./auth');

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
app.get('/chatbot', (req,res) => {

  input = req.query.input;
  chatId = req.query.cs;

  if (input) {
    // res.send("Your input was:" + input);

    cbot.query(input, {
      cs: chatId
    }).then((cres) =>{
      console.log(cres);
      var cObj = { output: cres.output,
                   cs    : cres.cs}
      res.json(cObj);
    });
  } else {
    res.send("err");
  }
});

app.post('/login', (req, res)=> {
  //TODO: Create a user database in firebase/GCP/
    let account = req.body;

    if (account) {

    }
});

app.post('/signup', (req, res)=> {
    var newAccount = req.body;
    console.log(newAccount);
    // res.send(newAccount);
    var user = auth.addUser(newAccount.username, newAccount.password);
    res.send(user);
});



app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
