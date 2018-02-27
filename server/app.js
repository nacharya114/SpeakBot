var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var db = mongojs("p2p", ['orders']);

app.use(bodyParser());


mongoose.connect('mongodb://localhost:27017/test');
var dbMongoose = mongoose.connection;
dbMongoose.on('error', console.error.bind(console, 'connection error:'));
dbMongoose.once('open', function() {
  console.log("Mongoose Connected to DB!");
});

var usernameSchema = new mongoose.Schema({username: String}, {collection: 'usernames_passwords'});
var userModel = mongoose.model('Username',usernameSchema);

// ************ USE BELOW WHEN HAVE USERNAME COLLECTION *****************

// usernameSchema.methods.getUsername = function() {
//   return this.usermodel('username').find({ type: this.type });
// };

app.use('/',express.static(path.resolve(__dirname,'../www')));
app.use(bodyParser());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	console.log(req.method,req.path,req.body);
})
app.route('/api/orders')
.get(function (req, res) {
	var status = req.query.complete;
  var incoming = req.query.incoming;
  console.log("complete is ", status);
  console.log("incoming is ", incoming);
	if (status){
    if (status == "true") {
      console.log("sending");
      db.orders.find({complete: true}, function(err, docs) {
      if (err) console.log(err);
        res.json(docs);
      });
    } else {
      db.orders.find({complete: false}, function(err, docs) {
      if (err) console.log(err);
        res.json(docs);
      });
    }
	}else if (incoming) {
    if (incoming == 'true') {
      db.orders.find({incoming: true}, function(err, docs){
        if (err) console.log(err);
        res.json(docs);
      });
    } else {
      db.orders.find({incoming: false}, function(err, docs){
        if (err) console.log(err);
          res.json(docs);
        });
      }
    } else {
      db.orders.find(function(err, docs){
        if (err) console.log(err);
        res.json(docs);
      });
      console.log("finished send");
	}
/*  insertDocuments(db, function() {
    updateDocument(db, function() {
      deleteDocument(db, function() {
        findDocuments(db, function() {
          db.close();
        });
      });
    });
  });*/

})
.post(function (req,res){
	console.log("POST BEING MADE!",req.body);
	db.orders.insert(req.body, function(err, doc) {
        if (err){
        	console.log(err);
        }else{
        	res.json(doc);
        	console.log(doc);
        }
    });
});

// app.route("api/users")
// .get(function (req, res) {
//   // body...

//   userModel.getUsername(function(err, username) {
//       res.json(username);
//   });
  
// });
/*.post(function(req, res) {

});*/



app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

// var insertDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the document collection");
//     callback(result);
//   });
// }

// var updateDocument = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Update document where a is 2, set b equal to 1
//   collection.updateOne({ a : 2 }
//     , { $set: { b : 1 } }, function(err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     console.log("Updated the document with the field a equal to 2");
//     callback(result);
//   });
// }

// var deleteDocument = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Insert some documents
//   collection.deleteOne({ a : 3 }, function(err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     console.log("Removed the document with the field a equal to 3");
//     callback(result);
//   });
// }

// var findDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Find some documents
//   collection.find({}).toArray(function(err, docs) {
//     assert.equal(err, null);
//     assert.equal(2, docs.length);
//     console.log("Found the following records");
//     console.dir(docs);
//     callback(docs);
//   });
// }

// function exitHandler(options, err) {
//     database.close();
// }

// //do something when app is closing
// process.on('exit', exitHandler);

// //catches ctrl+c event
// process.on('SIGINT', exitHandler);

// //catches uncaught exceptions
// process.on('uncaughtException', exitHandler);