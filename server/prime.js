var request = require('request');
var querystring = require('querystring');

var prime = {
  "fr-FR": {
      "vtext2": "Bonjour",
      "vtext3": "Bonjour, Cleverbot",
      "input": "Posez-moi une question"
    },
  "de-DE": {
      "vtext2": "Guten Tag",
      "vtext3": "Guten Tag, Cleverbot",
      "input": "Fragen Sich mich etwas"
  },
  "en-US": {
      "vtext2": "Hello",
      "vtext3": "Hello, Cleverbot",
      "input": "Ask me a question!"
  },
  "es-MX": {
    "vtext2": "Yo estoy bien",
    "vtext3": "Como estas",
    "vtext4": "Hola",
    "vtext5": "Hola",
    "input": "Preguntar una pregunta, por favor"
  }
};

var key = {"key": "CC8hy0Bny7N8DtVbWrw3EYKGSIQ" };

const endpoint = "https://www.cleverbot.com/getreply";

module.exports = {
  //Gets the message-primed response from Cleverbot and returns it in a promise
  //@param: lang - the language of the chat.
  getNewChat(lang) {
    //TODO: Modify cleverbot tweaks and see if they persist as the chat goes on

    //This creates the url string to query for cleverbot with changes to previous messages
    var end_url = endpoint + "?" + querystring.stringify(key)+ "&" + querystring.stringify(prime[lang]);
    var p = new Promise((resolve, reject) => {
      //Requests the url (GET request) and retrieves the error, resp, and body
      request(end_url, (error, resp, body) => {
          if (error) {
            reject(error);
          } else {
            var data = JSON.parse(body);
            // console.log(data);
            resolve(data);        //Returns the JSON-parsed data.
          }
        });
    });
    return p;
  }
}
