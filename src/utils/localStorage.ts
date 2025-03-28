/**
 * Enhanced localStorage utility with error handling, versioning and expiration
 */

const APP_PREFIX = 'fixitquick';
const STORAGE_VERSION = 1;

// Storage keys with namespacing
export const STORAGE_KEYS = {
  USER: `${APP_PREFIX}-user`,
  USERS: `${APP_PREFIX}-users`,
  THEME: `${APP_PREFIX}-theme`,
  RECENTLY_VIEWED: `${APP_PREFIX}-recently-viewed`,
  BOOKMARKS: (userId: string) => `${APP_PREFIX}-bookmarks-${userId}`,
  FEEDBACK: (solutionId: string) => `${APP_PREFIX}-feedback-${solutionId}`,
  FEEDBACK_COMMENTS: `${APP_PREFIX}-feedback-comments`,
  SUGGESTED_SOLUTIONS: `${APP_PREFIX}-suggested-solutions`,
  STORAGE_VERSION: `${APP_PREFIX}-storage-version`
};

// Type for items with expiration
interface StorageItemWithExpiry<T> {
  value: T;
  expiry: number | null; // Timestamp or null for no expiration
  version: number;
}

/**
 * Set an item in localStorage with optional expiration
 */
export function setStorageItem<T>(
  key: string, 
  value: T, 
  expiryInMinutes: number | null = null
): boolean {
  try {
    const item: StorageItemWithExpiry<T> = {
      value,
      expiry: expiryInMinutes ? new Date().getTime() + expiryInMinutes * 60000 : null,
      version: STORAGE_VERSION
    };

    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
    return false;
  }
}

/**
 * Get an item from localStorage with expiration and version check
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const itemStr = localStorage.getItem(key);
    
    // Return default if item doesn't exist
    if (!itemStr) {
      return defaultValue;
    }

    const item: StorageItemWithExpiry<T> = JSON.parse(itemStr);
    
    // Check if the item is from an older version
    if (!item.version || item.version < STORAGE_VERSION) {
      // Handle migration if needed in the future
      // For now, just use the item as is
    }
    
    // Check for expiration
    if (item.expiry && new Date().getTime() > item.expiry) {
      // Item has expired, remove it
      localStorage.removeItem(key);
      return defaultValue;
    }
    
    return item.value;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
    return false;
  }
}

/**
 * Clear all app-related items from localStorage
 */
export function clearAppStorage(): boolean {
  try {
    Object.values(STORAGE_KEYS)
      .filter(key => typeof key === 'string')
      .forEach(key => localStorage.removeItem(key as string));
      
    // Also clear any dynamic keys (like bookmarks for different users)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing app storage:', error);
    return false;
  }
}

/**
 * Simple encryption/decryption for sensitive data
 * Note: This is NOT secure encryption, just obfuscation to prevent casual inspection
 */
export function encryptData(data: string): string {
  return btoa(data);
}

export function decryptData(encryptedData: string): string {
  try {
    return atob(encryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return '';
  }
}

/**
 * Initialize storage version if not already set
 */
export function initializeStorage(): void {
  const version = localStorage.getItem(STORAGE_KEYS.STORAGE_VERSION);
  if (!version) {
    localStorage.setItem(STORAGE_KEYS.STORAGE_VERSION, STORAGE_VERSION.toString());
  }
}

// Run initialization
initializeStorage();
