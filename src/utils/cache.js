const DB_NAME = 'AdminPanelDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedData(key, expiryMs = null) {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(['cache'], 'readonly');
    const store = transaction.objectStore('cache');
    const request = store.get(key);
    request.onsuccess = () => {
      const data = request.result;
      if (data && (expiryMs === null || Date.now() - data.timestamp < expiryMs)) {
        resolve(data.value);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => resolve(null);
  });
}

export async function setCachedData(key, value) {
  const db = await openDB();
  const transaction = db.transaction(['cache'], 'readwrite');
  const store = transaction.objectStore('cache');
  store.put({ value, timestamp: Date.now() }, key);
}

export async function clearCache(key) {
  const db = await openDB();
  const transaction = db.transaction(['cache'], 'readwrite');
  const store = transaction.objectStore('cache');
  store.delete(key);
}
