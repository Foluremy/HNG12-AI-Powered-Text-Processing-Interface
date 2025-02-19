import { useEffect, useState } from 'react';
import { detectLanguage } from '../../services/languageDetector';
import styles from './Message.module.css';

export default function Message({ text }) {
  const [detectedLanguage, setDetectedLanguage] = useState('Detecting...');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [summary, setSummary] = useState('');
  const [translation, setTranslation] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  // Detect language on input
  useEffect(() => {
    const detectLanguageOnInput = async () => {
      if (!text.trim()) {
        setDetectedLanguage('not sure what language this is');
        return;
      }

      try {
        const { detectedLanguage } = await detectLanguage(text);
        setDetectedLanguage(detectedLanguage);
      } catch (error) {
        setDetectedLanguage('Language detection failed.');
      }
    };

    detectLanguageOnInput();
  }, [text]);

  // Handle Summarize
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeText(text);
      setSummary(summary);
    } catch (error) {
      setError('Summarization failed. Please try again.');
    }
    setIsSummarizing(false);
  };

  // Handle Translate button
  const handleTranslate = async () => {
    setIsTranslating(true);
    setError('');
    try {
      const translatedText = await translateText(text, targetLanguage);
      setTranslation(translatedText);
      setError('');
    } catch (error) {
      setError('Translation failed. Please try again.');
    }
    setIsTranslating(false);
  };

  return (
    <div className={styles.message} role="article">
      <p>{text}</p>
      {error && <p className="error">{error}</p>}
      <p className='detect-lang'>Detected: {detectedLanguage}</p>
      <div className={styles.actionButtons}>
        {/* Summarize Button (only show if text is English and > 150 words) */}
        {detectedLanguage.includes('en') && text.split(' ').length > 150 ? (
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            aria-label="Summarize text"
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </button>
        ) : (
          <>
            {!detectedLanguage.includes('en') && (
              <p>Summarize is only available for English text.</p>
            )}
            {detectedLanguage.includes('en') && text.split(' ').length <= 150 && (
              <p>Summarize is only available for text longer than 150 words.</p>
            )}
          </>
        )}
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          aria-label="Select target language"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="tr">Turkish</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
        </select>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          aria-label="Translate text"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>

        {summary && <p>Summary: {summary}</p>}
        {translation && <p>Translation: {translation}</p>}
      </div>
    </div>
  );
}