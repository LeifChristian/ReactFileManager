
import './App.css';
import FileManager from './FileManager';
// import React, { Component }  from 'react'; ==> this line was needed for AWS deploy

function App() {
  
  return (
    <div className="App">
<h2 id = "title">React File Self Editor, lol</h2>

    <FileManager></FileManager>
    </div>
  );
}

export default App;
