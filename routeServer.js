import fs from 'fs'
import path from 'path'
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/src/')));
dotenv.config();
const API_SECRET = process.env.API_SECRET;

// console.log(API_SECRET);

app.get('/getFiles', (req, res) => { 

// console.log(typeof(API_SECRET));
// console.log(typeof(req.query.string))

if(API_SECRET!==req.query.string){console.log('invalid auth');res.send("2"); return;}

fs.readdir('./client/src/filesToParse',  (err, files) => {
    if (err) {
      console.log(err);
      return;
    }


    console.log(files);

    console.log(typeof(files))

    let myArray = [...Object.values(files)];

    let filesAndTimes = [];
    console.log(myArray);
    console.log(myArray[0])

    myArray.forEach((file, index) => {   
    let { mtime } = fs.statSync(`./client/src/filesToParse/${myArray[index]}`)
    // console.log("Name:", file, "Created:", birthtime)
      let thingy = Date.parse(mtime);
      console.log(thingy, 'numerical date')

      // fs.lstatSync(`./client/src/filesToParse/${myArray[index]}`).isDirectory();
      
let isDirExists = (fs.lstatSync(`./client/src/filesToParse/${myArray[index]}`).isDirectory())

console.log(isDirExists, "isdir?")

      let theObject = {
        Name: file,
        Created: thingy,
        isDirectory: isDirExists
      };

      filesAndTimes.push(theObject)
    })

    console.log(filesAndTimes)
    console.log('Sent list of files');
    res.json(filesAndTimes);
  });

});

app.post('/getFile', (req, res, next) => {

  console.log(req.query, 'eistttttttttttttttttt')

  if(API_SECRET!==req.query.string){console.log('invalid auth');res.send("2"); return;}

    console.log(req.query.fileName, 'req');

    // console.log(req.query.string, "streeeeeeeeeeeeeeeeeeeeeeeee")

    // res.status(201).json({
    //   message: 'Thing created successfully!'
    // });

let file = fs.readFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.query.fileName}`), 'utf8'); 
// fileToConvertToText.ass

res.send(file.toString())

  });

app.post('/writeFile', (req, res, next) => {

//  if(API_SECRET==req.query.string){res.json(404); return;}

 if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    console.log(req.body.file, " -file");
    console.log(req.body.text, ' -text');
    // let parsedText = JSON.parse(req.body.text);
    fs.writeFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.body.file}`), req.body.text, {encoding:'utf8',flag:'w'})
    res.send(req.body)

  });

  app.post('/renameFile', (req,res,next) => {
    console.log(req.body.newFileName, " -file");
    console.log(req.body.file)
    console.log(req.body.API_SECRET, 'seeee')

    if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    console.log('rename route');
    res.send('rename route response')

    if(req.body.newFileName.length>0){fs.rename( path.resolve(__dirname, `./client/src/filesToParse/${req.body.file}`), path.resolve(__dirname, `./client/src/filesToParse/${req.body.newFileName}`), (res)=>{console.log(res)})
  }
   
  })

  app.post('/deleteFile', (req,res,next) => {
    console.log(req.body.fileToDelete, 'file to Delete')
    console.log('delete route');
    // console.log(req.body.API_SECRET, 'seeee')

    if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    if(req.body.fileToDelete){
      fs.unlink(path.resolve(__dirname, `./client/src/filesToParse/${req.body.fileToDelete}`), res => console.log(res))
    }

  })

  app.post('/createFile', (req,res,next) => {

    // console.log(req.body.API_SECRET, "SECRET")
     if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    console.log(req.body.newCreatedFileName, " -new file name");
    console.log(req.body.test, ' -created date')
    console.log('create file route');

    if(req.body.newCreatedFileName.length>0){     
      fs.appendFile(path.resolve(__dirname, `./client/src/filesToParse/${req.body.newCreatedFileName}`), "new File", (res)=>{console.log(res)})
      res.send(req.body.newCreatedFileName)
  } 
  })

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    // res.sendFile(path.join(__dirname+'/client/src/'));
    res.send('route error, check your route parameters')
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log('App is listening on port ' + port);

// Below is sample code for automated function, call to other API, or returning text of file passed into go('test.txt')
const go = async (fileToConvertToText) => {
    // const __dirname = path.dirname(__filename);
let file = fs.readFileSync(path.resolve(__dirname, `${fileToConvertToText}`), 'utf8'); 
console.log(file.toString())


// const response = await fetch('http://jsonplaceholder.typicode.com/', {
//     method: 'GET',
//     mode: 'cors',
//     headers: { 'Content-Type': 'application/json' }
//   })
//   console.log(response, "typicode response")
return (file.toString());
}
// go('./test.txt')

// ~𝓛ⲉⲓ𝓯 Ⲥⲏꞅⲓ𝛓ⲧⲓⲁⲛ