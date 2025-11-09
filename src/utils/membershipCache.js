// IndexedDB utility for caching membership data
const DB_NAME = 'MembershipDB';
const DB_VERSION = 1;
const STORE_NAME = 'memberships';

// Open IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save data to IndexedDB
export const saveMembershipsToDB = async (data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear old data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // Add new data with timestamp
    const dataWithTimestamp = data.map(item => ({
      ...item,
      updatedAt: new Date().toISOString()
    }));

    for (const item of dataWithTimestamp) {
      await new Promise((resolve, reject) => {
        const addRequest = store.add(item);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      });
    }

    db.close();
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
  }
};

// Load data from IndexedDB
export const loadMembershipsFromDB = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const data = request.result;
        db.close();
        resolve(data);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error loading from IndexedDB:', error);
    return [];
  }
};

// Check if data is stale (older than 5 minutes)
export const isDataStale = (data) => {
  if (!data || data.length === 0) return true;
  const lastUpdate = new Date(data[0].updatedAt);
  const now = new Date();
  const diffMinutes = (now - lastUpdate) / (1000 * 60);
  return diffMinutes > 5;
};
