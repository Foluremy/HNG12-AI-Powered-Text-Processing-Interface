export const detectLanguage = async (text) => {
  console.log('Checking for Language Detector API...');

  // Check if the API is supported
  if (!('ai' in self) || !('languageDetector' in self.ai)) {
    throw new Error('Language detection is not supported in this browser.');
  }
  console.log('AI object and Language Detector API is supported.');

  // Check capabilities
  const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.capabilities;

  // Initialize detector
  let detector;
  if (canDetect === 'no') {
    throw new Error('The language detector is not usable.');
  } else if (canDetect === 'readily') {
    console.log('The language detector can immediately be used.');
    detector = await self.ai.languageDetector.create();
  } else {
    console.log('The language detector can be used after model download.');
    detector = await self.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
    await detector.ready;
  }

  if (!detector || typeof detector.detect !== 'function') {
    throw new Error('Detector object is invalid or missing detect method.');
  }

  // Handle empty input
  if (!text.trim()) {
    console.log('Input text is empty.');
    return { detectedLanguage: 'unknown', confidence: 0 };
  }

  // Detect the language
  console.log('Detecting language...');
  const [{ detectedLanguage }] = await detector.detect(text.trim());
  console.log('Detected Language:', detectedLanguage);
  return { detectedLanguage };
};
  
