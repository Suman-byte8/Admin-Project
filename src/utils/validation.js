// Utility functions for validation

export const getWordCount = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const validateWordCount = (text, min, max) => {
  const count = getWordCount(text);
  if (count < min) return { isValid: false, message: `Minimum ${min} words required. Current: ${count}` };
  if (count > max) return { isValid: false, message: `Maximum ${max} words allowed. Current: ${count}` };
  return { isValid: true, message: `${count}/${max} words` };
};

export const getWordCountDisplay = (text, max) => {
  const count = getWordCount(text);
  const color = count > max ? 'text-red-500' : count >= max * 0.9 ? 'text-yellow-500' : 'text-gray-500';
  return { count, color, text: `${count}/${max}` };
};
