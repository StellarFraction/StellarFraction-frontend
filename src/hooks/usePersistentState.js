import { useEffect, useState } from 'react';

const getStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readStoredValue = (storageKey, initialValue) => {
  const storage = getStorage();
  if (!storage) return initialValue;

  let storedValue;
  try {
    storedValue = storage.getItem(storageKey);
  } catch {
    return initialValue;
  }

  if (storedValue === null) return initialValue;

  try {
    return JSON.parse(storedValue);
  } catch {
    try {
      storage.removeItem(storageKey);
    } catch {
      // Storage can become unavailable after the initial read.
    }
    return initialValue;
  }
};

export function usePersistentState(storageKey, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(storageKey, initialValue));

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;

    try {
      storage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Keep the updated value in React state when persistent storage is blocked.
    }
  }, [storageKey, value]);

  return [value, setValue];
}
