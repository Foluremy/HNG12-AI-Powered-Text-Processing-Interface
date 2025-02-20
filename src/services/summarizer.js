export const summarizeText = async (text, options = {}) => {
  console.log('Checking for Summarizer API...');

  // Check if the API is supported
  if ('ai' in self && 'summarizer' in self.ai) {
    console.log('Summarizer API is supported.');
  } else {
    console.error('Summarizer API is not supported.');
  }
 
  // Check capabilities
  const capabilities = await self.ai.summarizer.capabilities();
  const available = capabilities.available;

  if (available === 'no') {
    throw new Error('The Summarizer API is not usable at the moment.');
  }

  // Initialize summarizer
  let summarizer;
  if (available === 'readily') {
    console.log('The Summarizer API can be used immediately.');
    summarizer = await self.ai.summarizer.create(options);
  } else {
    console.log('The Summarizer API requires a model download.');
    summarizer = await self.ai.summarizer.create({
      ...options,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
    await summarizer.ready;
  }

  if (!summarizer || typeof summarizer.summarize !== 'function') {
    throw new Error('Summarizer object is invalid or missing summarize method.');
  }

  // Summarize the text
  console.log('Summarizing text...');
  const summary = await summarizer.summarize(text.trim());
  console.log('Summary:', summary);
  return summary;
};