var express = require('express');
var path = require('path');
var app = express();
var bodyparser =require('body-parser');

const Cleverbot = require('cleverbot');
var cbot = new Cleverbot({key: "CC7i1plOP5-fomRyfjyWM33QSkg"});

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

app.get("/", (req, res) =>{
  res.send("hello");
});

/*this ignores conversation history
and just sends each message as a new conversation */
app.get('/chatbot', (req,res) => {

  input = req.query.input;
  chatId = req.query.cs;

  console.log("User Input: " + input);
  console.log("Incoming Chat Id: " + chatId);
  console.log("");


  if (input) {
    // res.send("Your input was:" + input);

    cbot.query(input, {
      cs: chatId
    }).then((cres) =>{
      
      console.log("Cleverbot Output: " + cres.output);
      console.log("Cleverbot ChatId: " + cres.cs);
      console.log();

      var cObj = { output: cres.output,
                   cs    : cres.cs}
      res.json(cObj);
    });
  } else {
    res.send("err");
  }
});




app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
