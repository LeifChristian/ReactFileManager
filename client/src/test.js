import React from 'react';

import axios from 'axios';

import { useEffect, useState, Button } from 'react';

export default function Test() {

    
    const [filesToParse, changeFilesToParse] = useState([]);

    const [textFromFile, changeTextFromFile] = useState('')

const getFileInfo = async (fileName) => {

    // axios.post('/getFile').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})

    await axios.post(`/getFile?fileName=${fileName}`, 
      ).then((res) => {console.log(res.data); changeTextFromFile(res.data)});


} 

  let  i=0;

    useEffect(() => {

        if(i==0){
        console.log('useffect test')
        axios.get('/getFiles').then((res) =>{ console.log(res.data, "reactres"); changeFilesToParse(res.data)})
    
    i++}
       
      }, [])

  return (

    <div>

       { filesToParse.map((item, index) => 
    
       <div key={index}><button onClick={()=>{console.log(item); getFileInfo(item)}}>{item}</button>
       
       </div>
       
       
       )}

       <div>{textFromFile}</div>
        
        
        </div>
  )
}
