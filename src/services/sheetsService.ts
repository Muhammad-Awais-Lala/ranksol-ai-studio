/**
 * Sheets Service
 * Handles fetching texture/material sheets from API
 */

import axios from 'axios';

export interface Sheet {
    id: string;
    path: string;
    name: string;
    thumbnail?: string;
    category?: string;
    description?: string;
}

import { API_BASE_URL } from '../../constants';

// Configuration
const BASE_API_URL = API_BASE_URL + '/areas/products';
const CACHE_KEY_PREFIX = 'sheets_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch sheets from API
 * Includes caching mechanism to reduce API calls
 */
export async function fetchSheets(slugOrSlugs?: string | string[], page: number = 1, useCache: boolean = true): Promise<Sheet[]> {
    // If no slug is provided, return empty array
    if (!slugOrSlugs || (Array.isArray(slugOrSlugs) && slugOrSlugs.length === 0)) {
        return Promise.resolve([]);
    }

    const slugs = Array.isArray(slugOrSlugs) ? slugOrSlugs : [slugOrSlugs];
    const cacheKey = `${slugs.slice().sort().join(',')}_page_${page}`;

    // Check cache first
    if (useCache) {
        const cached = getCachedSheets(cacheKey);
        if (cached) {
            return cached;
        }
    }

    // Fetch from API
    try {
        console.log("BASE_API_URL", BASE_API_URL);
        const response = await axios.post(`${BASE_API_URL}?page=${page}`, {
            slugs: slugs
        });
        // console.log("slugs====>", slugs, "page====>", page);
        const data = response.data;
        // The API response structure might vary, adapting to common patterns
        // Assuming data is array of sheets or has a sheets property

        let sheets: Sheet[] = [];

        if (Array.isArray(data)) {
            sheets = data;
        } else if (data.sheets && Array.isArray(data.sheets)) {
            sheets = data.sheets;
        } else if (data.data && Array.isArray(data.data)) {
            sheets = data.data;
        } else {
            // As a fallback, let's wrap it if it looks like a single sheet.
            sheets = data ? [data] : [];
        }

        // Validate/Map response to Sheet interface if necessary
        const mappedSheets: Sheet[] = sheets.map((item: any) => ({
            id: String(item.id) || String(Math.random()),
            path: item.image, // Mapped 'image' to 'path'
            name: item.title || 'Untitled Sheet', // Mapped 'title' to 'name'
            thumbnail: item.image, // Mapped 'image' to 'thumbnail'
        })).filter(item => item.path); // Ensure path exists

        // Cache the result
        cacheSheets(cacheKey, mappedSheets);

        return mappedSheets;
    } catch (error) {
        console.error(`Error fetching sheets for slugs "${slugs.join(', ')}" page ${page} from API:`, error);
        return [];
    }
}

/**
 * Get cached sheets if available and not expired
 */
function getCachedSheets(cacheKey: string): Sheet[] | null {
    try {
        const key = `${CACHE_KEY_PREFIX}${cacheKey}`;
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error(`Error reading cache for key "${cacheKey}":`, error);
        return null;
    }
}

/**
 * Cache sheets data
 */
function cacheSheets(cacheKey: string, sheets: Sheet[]): void {
    try {
        const key = `${CACHE_KEY_PREFIX}${cacheKey}`;
        localStorage.setItem(key, JSON.stringify({
            data: sheets,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.error(`Error caching sheets for key "${cacheKey}":`, error);
    }
}

/**
 * Clear sheets cache
 */
export function clearSheetsCache(slug?: string): void {
    if (slug) {
        localStorage.removeItem(`${CACHE_KEY_PREFIX}${slug}`);
    } else {
        // Clear all sheet caches
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_KEY_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
}

/**
 * Refresh sheets (bypass cache)
 */
export async function refreshSheets(slug: string): Promise<Sheet[]> {
    clearSheetsCache(slug);
    return fetchSheets(slug, false);
}

/**
 * Get a single sheet by ID (Search in all detected sheets might be hard if we don't know the slug. 
 * For now, this might break if we rely on it without slug. 
 * But usually we pick from displayed sheets.)
 */
export async function getSheetById(id: string, slugOrSlugs?: string | string[]): Promise<Sheet | null> {
    const sheets = await fetchSheets(slugOrSlugs);
    return sheets.find(sheet => sheet.id === id) || null;
}

/**
 * Search sheets by name or category
 */
export async function searchSheets(query: string, slugOrSlugs?: string | string[]): Promise<Sheet[]> {
    const sheets = await fetchSheets(slugOrSlugs);
    const lowerQuery = query.toLowerCase();

    return sheets.filter(sheet =>
        sheet.name.toLowerCase().includes(lowerQuery) ||
        sheet.category?.toLowerCase().includes(lowerQuery) ||
        sheet.description?.toLowerCase().includes(lowerQuery)
    );
}
