export const detectLanguage = async (text) => {
    console.log('Checking for Language Detector API...');
  
    // Check if the API is supported
    if (!('ai' in self)) {
      console.error('AI object not found in self.');
      throw new Error('AI object not found in self.');
    }
  
    if (!('languageDetector' in self.ai)) {
      console.error('Language Detector API not found in self.ai.');
      throw new Error('Language Detector API not found in self.ai.');
    }
  
    console.log('Language Detector API is supported.');
  
    // Check capabilities
    const capabilities = await self.ai.languageDetector.capabilities();
    console.log('Capabilities:', capabilities);
  
    if (capabilities.capabilities === 'no') {
      throw new Error('Language Detector API is not usable at the moment.');
    }
  
    // Initialize the detector
    let detector;
    console.log('Detector object:', detector);
    if (capabilities.capabilities === 'readily') {
      console.log('Language Detector is ready to use.');
      detector = await self.ai.languageDetector.create();
      console.log('Detector object:', detector); 
    } else if (capabilities.capabilities === 'after-download') {
      console.log('Language Detector requires a download.');
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      
      await detector.ready;
    }

    if (!detector || typeof detector.detectLanguage !== 'function') {
      throw new Error('Detector object is invalid or missing detectLanguage method.');
    }
  
    // Detect the language
    console.log('Detecting language...');
    const detectedLang = await detector.detectLanguage(text);
    console.log('Detected Language:', detectedLang);
    return detectedLang;
  };
