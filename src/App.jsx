import { useState, useEffect } from 'react';
import InputArea from './components/InputArea/InputArea.jsx';
import Message from './components/Message/Message.jsx';
import './styles/global.css';

function App() {
  // Load messages from local storage on initial render
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);
  
  // Handle sending text
  const handleSend = (text) => {
    if (!text.trim()) return;
    const newMessage = { 
      id: Date.now(), 
      text,
      detectedLanguage: '',
      translation: '', 
      summary: '', 
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="app" role="main">
      <h1 className='heading'>💬 AI Text Processor</h1>
      <div className="output-area" aria-live="polite">
        {messages.map((msg) => (
          <Message 
            key={msg.id} 
            text={msg.text}
            detectedLanguage={msg.detectedLanguage}
          />
        ))}
      </div>
      <InputArea onSend={handleSend} />
    </div>
  );
}

export default App;