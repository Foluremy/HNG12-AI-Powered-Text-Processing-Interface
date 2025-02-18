import { useState } from 'react';
import InputArea from './components/InputArea/InputArea.jsx';
import Message from './components/Message/Message.jsx';
import './styles/global.css';

function App() {
  const [messages, setMessages] = useState([]);

  // Handle sending text
  const handleSend = (text) => {
    if (!text.trim()) return;
    const newMessage = { id: Date.now(), text };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="app" role="main">
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