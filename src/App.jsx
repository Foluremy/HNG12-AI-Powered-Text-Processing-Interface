import { useState, useEffect, useRef } from 'react';
import InputArea from './components/InputArea/InputArea.jsx';
import Message from './components/Message/Message.jsx';
import './styles/global.css';
import { FaTrash } from 'react-icons/fa';

function App() {
  // Load messages from local storage on initial render
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // Save theme to local storage and apply it
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const outputAreaRef = useRef(null); 

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (outputAreaRef.current) {
      outputAreaRef.current.scrollTop = outputAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear storage (messages)
  const clearStorage = () => {
    localStorage.removeItem('messages');
    setMessages([]); // Clear messages in state
  };
  
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
      <div className='head'>
        <div className='head-text'>
          <h1 className='heading'>💬 TextTron</h1>
          <p className='para'>Detect, Summarize, Translate</p>
        </div>
        <div className="header-buttons">
          <button onClick={clearStorage} className="clear-button" aria-label="Clear storage">
            <FaTrash />
          </button>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <div className="output-area" aria-live="polite" ref={outputAreaRef}>
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