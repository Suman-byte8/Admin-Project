// API caching utility using IndexedDB
import cache from './cache.js';

// Cache TTL configurations (in milliseconds)
const CACHE_TTL = {
  HOMEPAGE: 30 * 60 * 1000, // 30 minutes
  ABOUT_PAGE: 60 * 60 * 1000, // 1 hour
  FACILITIES: 45 * 60 * 1000, // 45 minutes
  OFFERS: 15 * 60 * 1000, // 15 minutes
  GALLERY: 60 * 60 * 1000, // 1 hour
  ROOMS: 30 * 60 * 1000, // 30 minutes
  MEMBERSHIP: 60 * 60 * 1000, // 1 hour
  RESERVATIONS: 10 * 60 * 1000, // 10 minutes
  USER_ACTIVITY: 5 * 60 * 1000, // 5 minutes
  DEFAULT: 30 * 60 * 1000 // 30 minutes
};

// Enhanced API call with caching
export const cachedApiCall = async (apiFunction, cacheKey, ttl = CACHE_TTL.DEFAULT) => {
  try {
    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving ${cacheKey} from cache`);
      return cachedData;
    }

    // If not in cache, make the API call
    console.log(`Fetching ${cacheKey} from API`);
    const data = await apiFunction();

    // Store in cache
    await cache.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    console.error(`Error in cached API call for ${cacheKey}:`, error);
    // If API call fails, try to return cached data even if expired
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        console.log(`Serving expired ${cacheKey} from cache due to API error`);
        return cachedData;
      }
    } catch (cacheError) {
      console.error('Cache retrieval also failed:', cacheError);
    }
    throw error;
  }
};

// Specific cached API functions for Admin Panel
export const cachedFetchHeroBanner = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content/home/hero-banner`);
    if (!response.ok) throw new Error('Failed to fetch hero banner');
    const result = await response.json();
    return result.heroBanners; // Return the heroBanners array
  },
  'heroBanner',
  CACHE_TTL.HOMEPAGE
);

export const cachedFetchDistinctives = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content/home/distinctives`);
    if (!response.ok) throw new Error('Failed to fetch distinctives');
    return response.json();
  },
  'distinctives',
  CACHE_TTL.HOMEPAGE
);

export const cachedFetchCuratedOffers = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content/home/get-curated-offers`);
    if (!response.ok) throw new Error('Failed to fetch offers');
    return response.json();
  },
  'curatedOffers',
  CACHE_TTL.OFFERS
);

export const cachedFetchAboutPage = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content/about`);
    if (!response.ok) throw new Error('Failed to fetch about page');
    return response.json();
  },
  'aboutPage',
  CACHE_TTL.ABOUT_PAGE
);

export const cachedFetchFacilities = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/facilities/get-facilities`);
    if (!response.ok) throw new Error('Failed to fetch facilities');
    const result = await response.json();
    return result.facilities; // Return the facilities array
  },
  'facilities',
  CACHE_TTL.FACILITIES
);

export const cachedFetchGallery = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content/gallery`);
    if (!response.ok) throw new Error('Failed to fetch gallery');
    const result = await response.json();
    return result.gallery || result; // Return the gallery array or the full response if no gallery key
  },
  'gallery',
  CACHE_TTL.GALLERY
);

export const cachedFetchRooms = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/get-rooms`);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    const result = await response.json();
    return result.rooms; // Return the rooms array
  },
  'rooms',
  CACHE_TTL.ROOMS
);

export const cachedFetchMembership = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/membership`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch membership');
    return response.json();
  },
  'membership',
  CACHE_TTL.MEMBERSHIP
);

export const cachedFetchReservations = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`);
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  },
  'reservations',
  CACHE_TTL.RESERVATIONS
);

export const cachedFetchUserActivity = () => cachedApiCall(
  async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-activity`);
    if (!response.ok) throw new Error('Failed to fetch user activity');
    return response.json();
  },
  'userActivity',
  CACHE_TTL.USER_ACTIVITY
);

// Utility functions
export const clearCache = () => cache.clear();
export const getCacheSize = () => cache.size();
export const invalidateCache = async (key) => {
  if (key === 'reservations') {
    // For reservations, we need to clear all cache keys that start with 'reservations_'
    // since they include filter parameters
    try {
      // Get all cache keys and delete those starting with 'reservations_'
      const db = await cache.db || await cache.init();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.openCursor();

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.key.startsWith('reservations_')) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing reservation caches:', error);
      // Fallback to clearing entire cache if pattern deletion fails
      return cache.clear();
    }
  } else {
    return cache.delete(key);
  }
};
