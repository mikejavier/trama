const textToSpeech = require('@google-cloud/text-to-speech');
const cors = require('cors');
const bodyParser = require('body-parser');
const url = require('url');
const queryString = require('query-string');
const express = require('express');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.send('<p>virus!!!</p>');
});

app.post('/audio', function(req, res) {
  const client = new textToSpeech.TextToSpeechClient({
    keyFilename: './amarelinho-cf3e48337daa.json',
  });
  
  const request = {
    input: { text: req.body.text },
    // Select the language and SSML Voice Gender (optional)
    voice: { languageCode: 'pt-Br', ssmlGender: 'NEUTRAL' },
    // Select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Performs the Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      return console.error('ERROR:', err);
    }
    res.json(response);
  });
});

app.listen(3000, function() {
  console.log('init server');
})