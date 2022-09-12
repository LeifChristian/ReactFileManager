import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './App.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    borderRadius: '.6em',
  },
};

export default function Test() {
    const [filesToParse, changeFilesToParse] = useState([]);
    const [textFromFile, changeTextFromFile] = useState('');
    const [currentFile, setCurrentFile] = useState('')
    const [fileName, setFileName] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);

const getFileInfo = async (fileName) => {

    // axios.post('/getFile').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})

    await axios.post(`/getFile?fileName=${fileName}`, 
      ).then((res) => {console.log(res.data); changeTextFromFile(res.data)});

} 

const editFileInfo = async (fileName) => {   
  await axios.post(`/getFile?fileName=${fileName}`, )
    .then((res) => {console.log(res.data); 
      changeTextFromFile(res.data)}); setIsOpen(true);  console.log(fileName)}

const writeToFile = async (updatedText, theFileToUpdate) => {

  console.log(updatedText, ' -updated text' )

var data = JSON.stringify({
  "file": theFileToUpdate,
  "text": updatedText,
});

var config = {
  method: 'post',
  url: 'http://localhost:5000/writeFile',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

}

const renameStuff = () => {

  let enteredName = prompt('Please enter new file name')

  setFileName(enteredName);

  var data = JSON.stringify({
    "file": currentFile,
    "newFileName": enteredName
  });
  
  var config = {
    method: 'post',
    url: 'http://localhost:5000/renameFile',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

  setIsOpen(false)

}

const deleteStuff = () => {

  // console.log(currentFile);

  {
    
    if(window.confirm(`DO you want to delete ${currentFile}?`)){
    
    // alert("yes")

    var data = JSON.stringify({
      "fileToDelete": currentFile,
    });
    
    var config = {
      method: 'post',
      url: 'http://localhost:5000/deleteFile',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

    axios.get('/getFiles').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})

    setIsOpen(false);
    changeTextFromFile('')
  
  } 
  
  else{setIsOpen(false); return}}

}

const createFile = () => {

  let newCreatedFileName = prompt('Please enter file name')

  var data = JSON.stringify({

    "newCreatedFileName": newCreatedFileName
  });
  
  var config = {
    method: 'post',
    url: 'http://localhost:5000/createFile',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

// let temp = fileName;
setFileName('');

axios.get('/getFiles').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})



}

    useEffect(() => {
      let  i=0;
        if(i===0){
        console.log('useffect test')
        axios.get('/getFiles').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})
    
    i++}
       
      }, [fileName])

  return (

    <div>

<Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      ><div id = "modalText"><textarea  value = {textFromFile} onChange={(e) => {changeTextFromFile(e.target.value)}}></textarea>

      <br></br>

      <div id = "modalButtons">   <button onClick={(e) => {setIsOpen(false); writeToFile(textFromFile, currentFile)}}>Save</button>
      
      <button onClick={() => setIsOpen(false)}>X</button>
        
      <button onClick={() => {renameStuff()}}>...</button>
      <button onClick={() => {deleteStuff()}}>D</button>
      
      </div></div>
      
      </Modal>
      
       { filesToParse.sort().map((item, index) => 
    
       <div id="modalButtons" key={index}>
        
        <button style={{color: 'lightblue', fontSize: '.8rem'}} onClick={()=>{; setCurrentFile(item); editFileInfo(item)}}>{item}</button>
        {/* <button  style={{color: 'lightblue', fontSize: '1rem', border: 'none'}} onClick={()=> {setCurrentFile(item); editFileInfo(item)}}>...</button> */}
       
       </div>
       
       )}
       <div id="modalButtons"><button onClick={()=> {createFile()}}>+</button></div>

       <div style={{padding: "2rem", fontSize: '1rem', fontWeight: '300', lineHeight: '30px', marginLeft: '50px', marginRight: '50px'}}>

        {/* toggle truncate string:
        
          {textFromFile}</div> */}
        
       {textFromFile.length > 5000 ?  textFromFile.toString().substring(0, 5000) + "...": textFromFile}
        
        
        </div>

        </div>
  )
}
