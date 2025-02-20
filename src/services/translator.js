export const translateText = async (text, sourceLanguage, targetLanguage) => {
    console.log('Checking for Translator API...');
  
    // Check if the API is supported
    if (!('ai' in self) || !('translator' in self.ai)) {
      throw new Error('Translation is not supported in this browser.');
    }
    console.log('AI object and Translator API is supported.');
  
    // Check capabilities
    const translatorCapabilities = await self.ai.translator.capabilities();
    const canTranslate = translatorCapabilities.languagePairAvailable(
      sourceLanguage, // Use the detected source language
      targetLanguage
    );
  
    if (canTranslate === 'no') {
      throw new Error(`Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`);
    }
  
    // Initialize translator
    let translator;
    if (canTranslate === 'readily') {
      console.log('The translator can immediately be used.');
      translator = await self.ai.translator.create({
        sourceLanguage, 
        targetLanguage,
      });
    } else {
      console.log('The translator can be used after model download.');
      translator = await self.ai.translator.create({
        sourceLanguage, 
        targetLanguage,
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await translator.ready;
    }
  
    if (!translator || typeof translator.translate !== 'function') {
      throw new Error('Translator object is invalid or missing translate method.');
    }
  
  
    // Translate the text
    console.log('Translating text...');
    const translatedText = await translator.translate(text.trim());
    console.log('Translated Text:', translatedText);
    return translatedText;
  };