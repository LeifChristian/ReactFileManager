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

if(req.query.folder !==""){console.log("contains folder: ", req.query.folder)
// !req.query.folder ? console.log('no folder sent with request, using base folder') : '';
fs.readdir(`./client/src/filesToParse/${req.query.folder}`,  (err, files) => {
  if (err) {
    console.log(err);
    return;
  }

  let myArray = [...Object.values(files)];
  let filesAndTimes = [];
  console.log(myArray);
  console.log(myArray[0])

  myArray.forEach((file, index) => {   
  let { mtime } = fs.statSync(`./client/src/filesToParse/${req.query.folder}/${myArray[index]}`)
  // console.log("Name:", file, "Created:", birthtime)
    let thingy = Date.parse(mtime);
    // console.log( myArray[index], 'birthtime: ', thingy)
    if(fs.existsSync(`./client/src/filesToParse/${req.query.folder}/${myArray[index]}`)) {console.log('')} else {console.log(`./client/src/filesToParse/${myArray[index]} doesn't exist`); return}
    let isDir = (fs.lstatSync(`./client/src/filesToParse/${req.query.folder}/${myArray[index]}`).isDirectory()) 

    let theObject = {
      Name: file,
      Created: thingy,
      isDirectory: isDir
    };

    filesAndTimes.push(theObject)
  })

  console.log(filesAndTimes)
  console.log('Sent list of files');
  res.json(filesAndTimes)
});
return;
} 

else
fs.readdir('./client/src/filesToParse',  (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(files);
    // console.log(typeof(files))

    let myArray = [...Object.values(files)];

    let filesAndTimes = [];
    // console.log(myArray);
    // console.log(myArray[0])

    myArray.forEach((file, index) => {   
    let { mtime } = fs.statSync(`./client/src/filesToParse/${myArray[index]}`)
      let thingy = Date.parse(mtime);
      // console.log( myArray[index], 'birthtime: ', thingy)
      // fs.lstatSync(`./client/src/filesToParse/${myArray[index]}`).isDirectory();
      if(fs.existsSync(`./client/src/filesToParse/${myArray[index]}`)) {null} else {console.log(`./client/src/filesToParse/${myArray[index]} doesn't exist`); return}
      
      let isDir = (fs.lstatSync(`./client/src/filesToParse/${myArray[index]}`).isDirectory()) 

// console.log("is it a directory: ", isDir )

      let theObject = {
        Name: file,
        Created: thingy,
        isDirectory: isDir
      };

      filesAndTimes.push(theObject)
    })

    console.log(filesAndTimes)
    console.log('Sent list of files');
    res.json(filesAndTimes);
  });

});

app.post('/getFile', (req, res, next) => {

  console.log('filename: ', req.query.fileName)
  console.log(req.query.directory, 'dir!')

  let isDir;

  if(req.query.directory!==""){isDir = (fs.lstatSync(`./client/src/filesToParse/${req.query.directory}/${req.query.fileName}`).isDirectory()) }

  else{isDir = (fs.lstatSync(`./client/src/filesToParse/${req.query.fileName}`).isDirectory()) }

  console.log('is it a directory: ', isDir)

  // isDir ? () => {console.log('its a dir!'); res.send('3'); return} : null;

  if(API_SECRET!==req.query.string){console.log('invalid auth');res.send("2"); return;}

    console.log(req.query.fileName, 'req');

    // console.log(req.query.string, "");
    // res.status(201).json({
    //   message: 'Thing created successfully!'
    // });

    if(!isDir){

let file;

console.log(typeof(req.query.directory))

req.query.directory=="" ? file = fs.readFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.query.fileName}`), 'utf8') :

   file= fs.readFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.query.directory}/${req.query.fileName}`), 'utf8')

res.send(file.toString())}

  });

app.post('/writeFile', (req, res, next) => {

//  if(API_SECRET==req.query.string){res.json(404); return;}

 if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    console.log(req.body.file, " -file");
    console.log(req.body.text, ' -text');
    console.log(req.body.directory, 'directory')

    if(req.body.directory!==''){

      fs.writeFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.body.directory}/${req.body.file}`), req.body.text, {encoding:'utf8',flag:'w'})
      res.send(req.body)
    }

    else if(req.body.directory==""){

      fs.writeFileSync(path.resolve(__dirname, `./client/src/filesToParse/${req.body.directory}/${req.body.file}`), req.body.text, {encoding:'utf8',flag:'w'})
      res.send(req.body)

    }

    // let parsedText = JSON.parse(req.body.text);
  
  });

  app.post('/renameFile', (req,res,next) => {
    console.log(req.body.newFileName, " -file");
    console.log(req.body.file)
    console.log(req.body.API_SECRET, 'seeee')
    console.log(req.body.directory, 'directory!')

    if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    console.log('rename route');
    res.send('rename route response')

    if(req.body.newFileName.length>0 && req.body.directory.length>0){fs.rename( path.resolve(__dirname, `./client/src/filesToParse/${req.body.file}`), path.resolve(__dirname, `./client/src/filesToParse/${req.body.newFileName}`), (res)=>{console.log(res)})
  }

  if(req.body.directory!==''){fs.rename( path.resolve(__dirname, `./client/src/filesToParse/${req.body.directory}/${req.body.file}`), path.resolve(__dirname, `./client/src/filesToParse/${req.body.directory}/${req.body.newFileName}`), (res)=>{console.log(res)})}
   
  })

  app.post('/deleteFile', (req,res,next) => {
    console.log(req.body.fileToDelete, 'file to Delete')
    console.log('delete route');
    // console.log(req.body.API_SECRET, 'seeee')

    if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    if(req.body.fileToDelete){

      if(req.body.directory!==""){

      fs.unlink(path.resolve(__dirname, `./client/src/filesToParse/${req.body.directory}/${req.body.fileToDelete}`), res => console.log(res))}

      else if(req.body.directory==""){  fs.unlink(path.resolve(__dirname, `./client/src/filesToParse/${req.body.fileToDelete}`), res => console.log(res))}
    }

  })

  app.post('/createFile', (req,res,next) => {

    // console.log(req.body.API_SECRET, "SECRET")
     if(API_SECRET!==req.body.API_SECRET){console.log('invalid auth');res.send("2"); return;}

    console.log(req.body.newCreatedFileName, " -new file name");
    console.log(req.body.test, ' -created date')
    console.log('create file route');
    console.log('directory:', req.body.directory)
    console.log(typeof(req.body.directory))

    if(req.body.newCreatedFileName==''){console.log('no filename'); res.send('no filename'); return}     

      if(req.body.directory==""){ console.log('empty dir');
      fs.appendFile(path.resolve(__dirname, `./client/src/filesToParse/${req.body.newCreatedFileName}`), "new File", (res)=>{console.log(res)})}

      else if(req.body.directory!==""){console.log('not empty dir')
        fs.appendFile(path.resolve(__dirname, `./client/src/filesToParse/${req.body.directory}/${req.body.newCreatedFileName}`), "new File", (res)=>{console.log(res)})

      }
      res.send(req.body.newCreatedFileName)
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