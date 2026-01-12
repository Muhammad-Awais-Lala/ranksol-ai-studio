
import { Type } from '@google/genai';

/** Represents a detected item in an image for recoloring. */
export interface DetectedItem {
  id: string; // Unique ID for selection, e.g., a UUID or index
  name: string; // The general name of the item (e.g., "Wardrobe")
  slug?: string; // The slug for backend API calls
  description: string; // A specific description provided by the AI (e.g., "the large wooden wardrobe on the left")
}

/** Interface for the expected JSON response from the AI for item detection. */
export interface DetectionResponseSchema {
  detectedItems: DetectedItem[];
}

/** Schema for the AI's detection response. */
export const DETECTION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['id', 'name', 'description'],
      },
      description: 'A list of detected items with unique IDs, general names, and specific descriptions.',
    },
  },
  required: ['detectedItems'],
};
