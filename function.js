
// import { Parser } from "simple-text-parser";
// const parser = new Parser();

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express, { text } from 'express';

import cors from 'cors';
import bodyParser from 'body-parser'

// let cors = require('cors');
// let bodyParser = require('body-parser');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());


let txt = '';
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/src/')));

// An api endpoint that returns a short list of items
app.get('/getFiles', (req, res) => { 

    var list = ["item1", "item2", "item3"];
    //  res.json(list);
    console.log('Sent list of items');

// fs.readdir(process.cwd(), function (err, files) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(files);
//   });

//above root dir working

  
fs.readdir('./client/src/filesToParse', function (err, files) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(files);

    res.json(files);
  });

//

    // res.send('backend')
});

app.post('/getFile', (req, res, next) => {
    console.log(req.query.fileName, 'req');

    // res.status(201).json({
    //   message: 'Thing created successfully!'
    // });

    // res.send(' filename Recieved: ' + req.query?.fileName) // working rec. and send filename

    // let textFromFile = go(`./client/src/filesToParse/${req.query.fileName}`);

    // console.log(textFromFile, 'aa');



let file = fs.readFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.query.fileName}`), 'utf8'); 
// fileToConvertToText.ass

res.send(file.toString())

// return (file.toString());




  });


  app.post('/writeFile', (req, res, next) => {
    // console.log(req.query.fileName, 'req');

    console.log(req.body);

// let file = fs.readFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.query.fileName}`), 'utf8'); 
// fileToConvertToText.ass

// res.send(file.toString())

let stringres = res.toString();
res.send(req.body)

  });

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/src/'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);


const go = async (fileToConvertToText) => {

    // const __dirname = path.dirname(__filename);

    let file = fs.readFileSync(path.resolve(__dirname, `${fileToConvertToText}`), 'utf8'); 
// fileToConvertToText.ass

console.log(file.toString())

return (file.toString());

// const response = await fetch('http://jsonplaceholder.typicode.com/', {
//     method: 'GET',
//     mode: 'cors',
//     headers: { 'Content-Type': 'application/json' }
//   })

//   console.log(response, "typicode response")

}

go('./test.txt')