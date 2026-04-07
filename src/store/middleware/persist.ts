import type { StateStorage } from 'zustand/middleware';

// Custom storage with error handling
export const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error(`Error reading from localStorage (${name}):`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error(`Error writing to localStorage (${name}):`, error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing from localStorage (${name}):`, error);
    }
  },
};

// Persist options with versioning
export const createPersistOptions = (name: string, version: number = 1) => ({
  name,
  version,
  storage: customStorage,
  // Optional: Add migration logic for version changes
  migrate: (persistedState: any, version: number) => {
    if (version === 0) {
      // Migration logic for v0 -> v1
      return persistedState;
    }
    return persistedState;
  },
});
