// Utility functions for managing filter state in localStorage

const STORAGE_KEY = 'reservationFilters';

// Default filter values
const DEFAULT_FILTERS = {
  type: "accommodation",
  status: "All Status",
  search: "",
  sortBy: "date_desc",
  page: 1,
  limit: 50,
};

/**
 * Save filters to localStorage
 */
export const saveFiltersToStorage = (filters) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters to localStorage:', error);
  }
};

/**
 * Load filters from localStorage
 */
export const loadFiltersFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedFilters = JSON.parse(stored);
      // Merge with defaults to ensure all required fields exist
      return { ...DEFAULT_FILTERS, ...parsedFilters };
    }
  } catch (error) {
    console.error('Failed to load filters from localStorage:', error);
  }
  return DEFAULT_FILTERS;
};

/**
 * Clear filters from localStorage
 */
export const clearFiltersFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear filters from localStorage:', error);
  }
};

/**
 * Check if filters exist in localStorage
 */
export const hasStoredFilters = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check stored filters:', error);
    return false;
  }
};
