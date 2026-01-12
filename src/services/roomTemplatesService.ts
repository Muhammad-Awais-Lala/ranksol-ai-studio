import axios from 'axios';
import { API_BASE_URL } from '../../constants';

export interface RoomTemplate {
    title: string;
    slug: string;
    image: string;
}

/**
 * Fetches room template images from the backend API
 * @returns A promise that resolves with an array of room templates
 */
export async function fetchRoomTemplates(): Promise<RoomTemplate[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/portfolio-templates`);

        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }

        console.warn('Room templates API returned unexpected format:', response.data);
        return [];
    } catch (error) {
        console.error('Failed to fetch room templates:', error);
        return [];
    }
}

/**
 * Converts an image URL to a File object (blob)
 * @param imageUrl The URL of the image to convert
 * @param fileName The name to give the file
 * @returns A promise that resolves with a File object
 */
export async function urlToFile(imageUrl: string, fileName: string): Promise<File> {
    try {
        // Ensure we always hit the correct backend domain
        let fullUrl = imageUrl;
        if (!imageUrl.startsWith('http')) {
            fullUrl = `https://kmigroups.com${imageUrl}`;
        }

        const response = await fetch(fullUrl);
        const blob = await response.blob();

        // Create a File object from the blob
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    } catch (error) {
        console.error('Failed to convert URL to file:', error);
        throw new Error(`Failed to load template image: ${error instanceof Error ? error.message : String(error)}`);
    }
}
