  import './App.css';
import React, { useState } from 'react';
import {MessageBox} from './MessageBox';
import { UserInput } from './UserInput';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const addMessageToBox = ()=> {
    setMessages([...messages, {text: input, align: "right"}]);
    setInput('');
    
  }


  return (
    <div className="App">
      <MessageBox messages={messages}/>
      <UserInput input={input} setInput={setInput} onSubmit={addMessageToBox}/>
    </div>



  );


}

export default App;
