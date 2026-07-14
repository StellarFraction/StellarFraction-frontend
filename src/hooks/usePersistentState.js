import { useEffect, useState } from 'react';

let storageResolved = false;
let safeStorage = null;

const resolveStorage = () => {
  if (storageResolved) return safeStorage;
  storageResolved = true;
  try {
    if (typeof window === 'undefined') {
      safeStorage = null;
      return null;
    }
    const storage = window.localStorage;
    const probeKey = '__stellar_fraction_storage_probe__';
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);
    safeStorage = storage;
  } catch {
    safeStorage = null;
  }
  return safeStorage;
};

const readStoredValue = (storageKey, initialValue) => {
  const storage = resolveStorage();
  if (!storage) return initialValue;

  const storedValue = storage.getItem(storageKey);

  if (storedValue === null) return initialValue;

  try {
    return JSON.parse(storedValue);
  } catch {
    try {
      storage.removeItem(storageKey);
    } catch {
      // ignore removal failures when storage is only partially available
    }
    return initialValue;
  }
};

export function usePersistentState(storageKey, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(storageKey, initialValue));

  useEffect(() => {
    const storage = resolveStorage();
    if (!storage) return;
    try {
      storage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Storage unavailable (private mode / quota exceeded): keep in-memory state only.
    }
  }, [storageKey, value]);

  return [value, setValue];
}
