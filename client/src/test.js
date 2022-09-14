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
  const { REACT_APP_MY_ENV } = process.env;
    const [filesToParse, changeFilesToParse] = useState([]);
    const [fullFileObject, changeFullFileObject] = useState([]);
    const [textFromFile, changeTextFromFile] = useState('');
    const [currentFile, setCurrentFile] = useState('')
    const [fileName, setFileName] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [sortABC, setSortABC] = useState(true);
    const [fileDate, setFileDate] = useState('')
    const [passwordEntered, setPasswordEntered] = useState(false);

const editFileInfo = async (fileName) => {   

  await axios.post(`/getFile?fileName=${fileName.Name}`, )
    .then((res) => {console.log(res.data); 
      
      changeTextFromFile(res.data)}); setIsOpen(true);  console.log(fileName)}
// console.log(REACT_APP_MY_ENV, 'env')
const writeToFile = async (updatedText, theFileToUpdate) => {

  console.log(updatedText, ' -updated text' )
  console.log(theFileToUpdate, ' -file object')

var data = JSON.stringify({
  "file": theFileToUpdate.Name,
  "text": updatedText,
});

var config = {
  method: 'post',
  url: '/writeFile',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});

}

const renameStuff = () => {

  let enteredName = prompt('Please enter new file name')

  setFileName(enteredName);

  var data = JSON.stringify({
    "file": currentFile.Name,
    "newFileName": enteredName
  });
  
  var config = {
    method: 'post',
    url: '/renameFile',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    setTrigger(prevState => !prevState)
  })
  .catch(function (error) {
    console.log(error);
  });

  setIsOpen(false)

  // setTrigger(prevState => !prevState)

}

const deleteStuff = () => {

  // console.log(currentFile);

    if(window.confirm(`Do you want to delete ${currentFile.Name}?`)){
    
    // alert("yes")

    var data = JSON.stringify({
      "fileToDelete": currentFile.Name,
    });
    
    var config = {
      method: 'post',
      url: '/deleteFile',
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

    axios.get('/getFiles').then((res) =>{ console.log(res.data, "reactres"); 
    
    const myArray = [...Object.values(res.data)];

    console.log(myArray[0].Name);
    const otherArray = []

    for( let i in myArray){
      otherArray.push(myArray[i].Name);
    }
  console.log(otherArray)

    changeFullFileObject(myArray)
    changeFilesToParse(otherArray)
    
    // changeFilesToParse(res.data)
  
  
  })

    setIsOpen(false);
    setTrigger(prevState => !prevState)
  
  } 
  
  else{setIsOpen(false);return}

}

const createFile = () => {

  const current = new Date();
  let date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  let dateString = current.toString();


  let newCreatedFileName = prompt('Please enter file name')

  var data = JSON.stringify({

    "newCreatedFileName": newCreatedFileName,
    "test": dateString
  });
  
  var config = {
    method: 'post',
    url: '/createFile',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    setTrigger(prevState => !prevState)
  })
  .catch(function (error) {
    console.log(error);
  });

}

    useEffect(() => {

      if(!passwordEntered){

        let password = prompt('Please enter password'); 
  
        if(password!==REACT_APP_MY_ENV){setTrigger(prevState=> !prevState); return;}

        setPasswordEntered(true);

      }

    axios.get('/getFiles').then((res) =>{ 
      // console.log(res.data, " --axios response"); 
    // console.log(typeof(res.data))
  

    const myArray = [...Object.values(res.data)];
     changeFullFileObject(myArray);
    //  console.log(fullFileObject, 'fyullsy')

     console.log(myArray, "array from response");
    const otherArray = []

    for( let i in myArray){
      otherArray.push(myArray[i].Name);
    }

  console.log(otherArray, " array of file names")

    changeFilesToParse(otherArray)})
       
      }, [trigger])

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

      <div id = "modalButtons">   <button onClick={(e) => {setIsOpen(false); writeToFile(textFromFile, currentFile)}}> <span role="img" aria-label="save">💾</span> </button>
      <button onClick={() => {deleteStuff()}}> <span role="img" aria-label="delete">☠️</span>  </button>
      <button onClick={() => {renameStuff()}}> <span role="img" aria-label="rename">📋</span> </button>
      <button onClick={() => setIsOpen(false)}> <span role="img" aria-label="cancel">🖖</span></button>
      </div></div>
      
      </Modal>

      {sortABC ? <button style={{color: 'lightblue', fontStyle:'italic'}} onClick={()=> {setSortABC(prevState=>!prevState)}}>A-Z</button> : 
      <button style={{color: 'lightblue', fontStyle:'italic', marginBottom: '1%'}} onClick={()=> {setSortABC(prevState=>!prevState)}}>MM/DD</button>  }

{sortABC ? 
      
       fullFileObject?.sort((a,b) => a.Name.localeCompare(b.Name)).map((item, index) => 
    
       <div id="modalButtons" key={index}>
        
        <button style={{color: 'lightblue', fontSize: '.8rem'}} onClick={()=>{; setCurrentFile(item); editFileInfo(item)}}>{item.Name}</button>
        {/* <button  style={{color: 'lightblue', fontSize: '1rem', border: 'none'}} onClick={()=> {setCurrentFile(item); editFileInfo(item)}}>...</button> */}
       
       </div>
       
       )

       :  fullFileObject?.sort((a,b) => b.Created - a.Created).map((item, index) => 
    
    <div id="modalButtons" key={index}>
     
     <button style={{color: 'lightblue', fontSize: '.8rem'}} onClick={()=>{; setCurrentFile(item); editFileInfo(item)}}>{item.Name} -- {new Date(item.Created).toString().substring(4,25)} {/* {item.Created}*/}</button>
     {/* <button  style={{color: 'lightblue', fontSize: '1rem', border: 'none'}} onClick={()=> {setCurrentFile(item); editFileInfo(item)}}>...</button> */}
    
    </div>
    
    )}





       <div id="modalButtons"><button onClick={()=> {createFile();}}>+</button></div>

       <div style={{padding: "2rem", fontSize: '1rem', fontWeight: '300', lineHeight: '30px', marginLeft: '2vw', marginRight: '2vw', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>

        {/* toggle truncate string:
        
          {textFromFile}</div> */}
        
       {textFromFile.length > 5000 ?  textFromFile.toString().substring(0, 5000) + "...": textFromFile}
        
        
        </div>

        </div>
  )
}
