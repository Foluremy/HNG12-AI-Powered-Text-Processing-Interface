export const summarizeText = async (text) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "This is a mock summary of your text.";
  };