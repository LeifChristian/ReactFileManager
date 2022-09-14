
import './App.css';
import Test from './test';
// import React, { Component }  from 'react'; ==> this line was needed for AWS deploy

function App() {
  
  return (
    <div className="App"><h2 id = "title">React File Manager</h2>
    <Test></Test>
    </div>
  );
}

export default App;
