import React from 'react';
import { MessageBox } from './MessageBox';
import { UserInput } from './UserInput';
import { io } from 'socket.io-client';


const socket = io('http://localhost:3005');

function Chatapp() {
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([]);


  function handleSend() {
    var text = input.trim();
    if (!text) return;


    setMessages(function (prev) {
      return prev.concat({ text: text, align: 'right' });
    });

    setInput('');


    socket.emit('user_message', text);
  }


  function handleClear() {
    setMessages([]);
  }


  React.useEffect(function () {
    function handleBotReply(text) {
      setMessages(function (prev) {
        return prev.concat({ text: text, align: 'left' });
      });
    }

    const handleHistory = (history) => {
      const formatted = [];
      for (let i = 0; i < history.length; i++) {
        const msg = history[i];
        if (msg.role === 'user') {
          formatted.push({ text: msg.content, align: 'right' });
        } else if (msg.role === 'assistant') {
          formatted.push({ text: msg.content, align: 'left' });
        }
      }
      setMessages(formatted);
    };

    function handleHardReset(message) {
      handleClear();
      setMessages([{ text: message, align: 'left' }]);
    }

    socket.on('chatbot_reply', handleBotReply);
    socket.on('message_history', handleHistory);
    socket.on('fallback_hard_reset', handleHardReset);

    return () => {
      socket.off('chatbot_reply', handleBotReply);
      socket.off('message_history', handleHistory);
      socket.off('fallback_hard_reset', handleHardReset);
    };
  }, []);


  return (
    <div className="App">
      <MessageBox messages={messages} />
      <UserInput
        input={input}
        setInput={setInput}
        onSubmit={handleSend}
        onClear={handleClear}
      />
    </div>
  );
}

export default Chatapp;
