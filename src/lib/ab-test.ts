import { useState, useEffect } from 'react';

/**
 * Simple A/B testing hook.
 * Randomly assigns a variant to a user and persists it in localStorage.
 */
export function useABTest(testName: string, variants: string[]) {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    const storageKey = `ab_test_${testName}`;
    let savedVariant = localStorage.getItem(storageKey);

    if (!savedVariant || !variants.includes(savedVariant)) {
      savedVariant = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(storageKey, savedVariant);
    }

    setVariant(savedVariant);
  }, [testName, variants]);

  const trackEvent = (eventName: string) => {
    console.log(`[A/B Test: ${testName}] Variant: ${variant} - Event: ${eventName}`);
    // In a real app, you would send this to an analytics service
  };

  return { variant, trackEvent };
}
