import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    borderRadius: '.6em'
  },
};

export default function Test() {
    const [filesToParse, changeFilesToParse] = useState([]);
    const [textFromFile, changeTextFromFile] = useState('');
    const [currentFile, setCurrentFile] = useState('')
    const [modalIsOpen, setIsOpen] = useState(false);

const getFileInfo = async (fileName) => {

    // axios.post('/getFile').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})

    await axios.post(`/getFile?fileName=${fileName}`, 
      ).then((res) => {console.log(res.data); changeTextFromFile(res.data)});

} 

const editFileInfo = async (fileName) => {   await axios.post(`/getFile?fileName=${fileName}`, 
).then((res) => {console.log(res.data); changeTextFromFile(res.data)}); setIsOpen(true);  console.log(fileName)}

//

const writeToFile = async (updatedText, theFileToUpdate) => {

  console.log(updatedText, ' -updated text' )

var axios = require('axios');
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

    useEffect(() => {
      let  i=0;
        if(i===0){
        console.log('useffect test')
        axios.get('/getFiles').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})
    
    i++}
       
      }, [])

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
      
      <button onClick={() => setIsOpen(false)}>X</button></div></div>
      
      </Modal>
       { filesToParse.map((item, index) => 
    
       <div key={index}>
        
        <button onClick={()=>{; setCurrentFile(item); getFileInfo(item)}}>{item}</button>
        <button  onClick={()=> {setCurrentFile(item); editFileInfo(item)}}>...</button>
       
       </div>
       
       
       )}

       <div style={{padding: "3rem"}}>{textFromFile}</div>
        
        
        </div>
  )
}
