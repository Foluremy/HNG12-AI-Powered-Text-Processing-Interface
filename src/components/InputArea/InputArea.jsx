import { useState } from 'react';
import styles from './InputArea.module.css';

export default function InputArea({ onSend }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsLoading(true);
    await onSend(text); 
    setText('');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text here..."
        aria-label="Text input"
        required // Ensure the textarea is not empty
      />
      <button type="submit" aria-label="Send message" disabled={isLoading}>
        {isLoading ? '⏳' : '➤'}
      </button>
    </form>
  );
}