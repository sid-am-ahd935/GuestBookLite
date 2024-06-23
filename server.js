require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { filter } = require("./filter");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.SERVER_HOST || 'localhost';
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/GuestBook_dev_v1_1';
const DEBUG = process.env.DEBUG || true;

function print(...args) {
    if(DEBUG == false) {
        return;
    }
    let str = "";
    for(let i=0; i<args.length; i++) {
        str += args[i] + " ";
    }
    str.slice(0, -1);
    str += "\n";
    process.stdout.write(str);
}

mongoose.connect(
    mongoURI
).then(() => {
    console.log('Database connection successful');
}).catch((err) => {
    console.error('Database connection failed', err);
});

// Define the note schema for MongoDB
const NoteSchema = new mongoose.Schema({
  text: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', NoteSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

// function httpPostRequest(options, postData) {
//   return new Promise(function(resolve, reject) {
//     const req = http.request(options, function(res) {
//       res.setEncoding('utf8');
//       let body = Array();
//       res.on('data', (chunk) => {
//         body.push(Buffer.from(chunk));
//       });

//       // res.on('error', (e) => {
//       //   console.error(`Problem with response: ${e.message}`);
//       //   reject(e);
//       // });

//       res.on('end', function() {
//         try {
//           body = JSON.parse(Buffer.concat(body).toString());
//         } catch(e) {
//           reject(e);
//         }
//         resolve(body);
//       });
//     });

//     req.on('error', (e) => {
//       reject(e);
//     });

//     req.write(postData);
//     req.end();
//   });
// }

app.get('/', async (req, res) => {
    return res.sendFile('./public/index.html', {'root' : __dirname});
});

// Get all notes (at website start)
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Submit a new note
app.post('/notes', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Please enter a note' });
  }

  let filtered_text = "";
  new Promise((resolve) => {resolve(await filter(text))}).then(function(filter_response) {
    filtered_text = filter_response;
    // console.log(`RECEIVED TEXT: ${filtered_text}; TYPE: ${typeof(filtered_text)}`);
    filtered_text = filtered_text.replace(/(\r\n|\n|\r)/gm, "");
  }).then(async function() {
    const newNote = new Note({ text: filtered_text });
    const savedNote = await newNote.save();
    // return "success";
    return savedNote; // makes it wait before exiting
  }).then(function(message) {
    // console.log(`${message}`);
    return res.status(200) ;//.json({message:message}); // so that frontend won't show undefined
  }).catch(function(err) {
    console.error(`[ERROR IN FILTER RESPONSE]: ${err}`);
    res.status(500).json({ message: 'Server Error' });
  });
  // try {
  //   filtered_text = "";
  //   const postData = JSON.stringify({
  //     'user_input': text
  //   });
  //   const options = {
  //     host: filter_domain,
  //     port: filter_port,
  //     path: '/filter',
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Content-Length': Buffer.byteLength(postData)
  //     }
  //   };

  //   httpPostRequest(options, postData).then(function(body) {
  //     filtered_text = body['message'];
  //     filtered_text = filtered_text.replace(/(\r\n|\n|\r)/gm, ""); // removing excess line breaks
  //   }).then(function() {
  //     const newNote = new Note({ text: filtered_text });
  //     const savedNote = newNote.save();
  //     return savedNote;
  //   }).then((message) => {
  //     return res.status(200).json(message);
  //   }).catch(function(err) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Server Error' });
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ message: 'Server Error' });
  // }
});

app.listen(port, host, () => console.log(`Server listening on port http://${host}:${port}`));
