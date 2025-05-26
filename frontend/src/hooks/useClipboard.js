import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  const read = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      return null;
    }
  }, []);

  return {
    copied,
    copy,
    read,
  };
};

export default useClipboard; 