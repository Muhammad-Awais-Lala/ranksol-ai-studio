import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GENERATION_MODEL } from "../../constants";
import { DetectedItem } from '../../types';

/**
 * Encodes a File object into a base64 string.
 * @param file The File object to encode.
 * @returns A Promise that resolves with the base64 encoded string.
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:mime/type;base64, prefix
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as string.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Decodes a base64 string to a Uint8Array.
 * @param base64 The base64 string to decode.
 * @returns The decoded Uint8Array.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


interface DetectableItem {
  name: string;
  slug?: string;
}

/**
 * Fetches detected items from the image using the Gemini API.
 * @param base64ImageData The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @param detectableItems List of items to look for. Can be strings or objects with name and slug.
 * @returns A promise that resolves with an array of detected items.
 */
export async function detectItemsInImage(
  base64ImageData: string,
  mimeType: string,
  detectableItems: (string | DetectableItem)[]
): Promise<DetectedItem[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  // Format the detectable items for the prompt
  // If an item has a slug, we pass the slug to help the model, but also the name for context
  const itemsForPrompt = detectableItems.map(item => {
    if (typeof item === 'string') {
      return item;
    }
    // If slug is present, prioritize it or combine it with name
    // Using format: "slug" (or "name") 
    return item.slug ? `"${item.slug}"` : `"${item.name}"`;
  }).join(', ');

  // Modified prompt to explicitly ask for JSON in text, as JSON mode is not supported for this model.
  const prompt = `You are an interior design assistant. Based on this image, identify any of the following items present: ${itemsForPrompt}. For each item found, provide a brief description that uniquely identifies it within the space (e.g., "the large wooden wardrobe on the left", "the washroom sink with two faucets in corner with white color"). Respond ONLY with a JSON array of objects, where each object has 'id'(a small unique id),'slug' (item name as i pass eg. "single-door-wardrobe"), 'name' (item name Captilized eg. "Single Door Wardrobe"), and 'description' (item description eg. "the large wooden wardrobe on the left"). Do not include any other text or markdown.`;
  // console.log(prompt);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      // Removed responseMimeType and responseSchema as they are not supported by gemini-2.5-flash-image for JSON output.
      // The model will return JSON as part of its text response.
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      console.error('No text response received from Gemini for detection, or response was empty.');
      return [];
    }

    try {
      // Attempt to parse the text response as JSON
      const parsedResponse = JSON.parse(jsonText);
      // The model is instructed to return an array directly
      if (Array.isArray(parsedResponse)) {
        // console.log('Detection successful:', parsedResponse);
        return parsedResponse;
      }
      console.error('Unexpected JSON structure for detection: expected an array, got', parsedResponse);
      return [];
    } catch (parseError) {
      console.error('Failed to parse detection JSON response:', parseError);
      console.debug('Raw JSON text:', jsonText);
      return [];
    }
  } catch (error) {
    console.error('Error detecting items with Gemini API:', error);
    throw new Error(`Failed to detect items: ${error instanceof Error ? error.message : String(error)}`);
  }
} // End of detectItemsInImage function.



/**
 * Replaces the color of a specific item in the image using the Gemini API.
 * @param originalBase64ImageData The base64 encoded original image data.
 * @param mimeType The MIME type of the image.
 * @param selectedItemDescription The description of the item to recolor.
 * @param newColor The new color (e.g., "royal blue", "#RRGGBB").
 * @returns A promise that resolves with the base64 encoded edited image data.
 */
export async function recolorImageItem(
  originalBase64ImageData: string,
  mimeType: string,
  selectedItemDescription: string,
  newColor: string,
): Promise<string> {
  const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `In this image, change the color of ${selectedItemDescription} to ${newColor}. Ensure only that specific item's color is modified, maintaining the original texture and other elements. Keep the surrounding environment untouched.
 
  WATERMARK:
   - Add a subtle "RankSol" watermark text in the bottom-right corner of the image.
   - Make it semi-transparent (about 30-40% opacity) and small enough to not obstruct the view.
   - Use a clean, professional font style.
   - The watermark should be visible but not distracting.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: originalBase64ImageData,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          // Assuming the first inlineData part is the edited image
          return part.inlineData.data;
        }
      }
    }

    throw new Error('No image data found in Gemini API response for recoloring.');
  } catch (error) {
    console.error('Error recoloring item with Gemini API:', error);
    throw new Error(`Failed to recolor item: ${error instanceof Error ? error.message : String(error)}`);
  }
}



/**
 * Applies a texture/material to one or multiple items in the image using the Gemini API.
 * @param originalBase64ImageData The base64 encoded original image data.
 * @param mimeType The MIME type of the image.
 * @param selectedItemDescriptions Array of item descriptions to apply texture to.
 * @param textureBase64 The base64 encoded texture/material image.
 * @param textureMimeType The MIME type of the texture image.
 * @returns A promise that resolves with the base64 encoded edited image data.
 */

export async function applyTextureToItem(
  originalBase64ImageData: string,
  mimeType: string,
  selectedItemDescriptions: string[],
  textureBase64: string,
  textureMimeType: string,
): Promise<string> {
  const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  // Build the items list for the prompt
  const itemCount = selectedItemDescriptions.length;
  const itemsList = selectedItemDescriptions
    .map((desc, index) => `   ${index + 1}. ${desc}`)
    .join('\n');

  const prompt = `
You are given two images:

1. TEXTURE IMAGE → Only use this image as a pattern to apply on the selected object(s).
2. BASE ROOM IMAGE → This is the real photo. You MUST return this image with the EXACT SAME width and height.

TASK:
Apply the texture from the texture image to the following ${itemCount} object${itemCount > 1 ? 's' : ''}:

${itemsList}

IMPORTANT INSTRUCTIONS:
- You MUST apply the texture to ALL ${itemCount} object${itemCount > 1 ? 's' : ''} listed above.
- Each object should receive the SAME texture pattern from the texture image.
- Process all objects in a SINGLE operation - do not skip any item.

CONSTRAINTS:
- The FINAL OUTPUT MUST match the EXACT dimensions of the BASE ROOM IMAGE.
- DO NOT resize, crop, distort, stretch, or change the base image in any way.
- Do NOT match the texture image's size — always match the base image.
- Apply texture ONLY to the ${itemCount} specified object${itemCount > 1 ? 's' : ''} listed above.
- Keep lighting, shadows, and object shape natural with realistic 3D appearance.
- Do NOT modify anything else in the room.

WATERMARK:
   - Add a subtle "RankSol" watermark text in the bottom-right corner of the image.
   - Make it semi-transparent (about 30-40% opacity) and small enough to not obstruct the view.
   - Use a clean, professional font style.
   - The watermark should be visible but not distracting.


IMPORTANT:
The last provided image is the BASE ROOM IMAGE. Always use ITS dimensions for the output.
`;

  try {
    console.log("Applying texture to room with Gemini API...");
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: {
        parts: [
          // --- TEXTURE IMAGE FIRST ---
          { text: "TEXTURE IMAGE (use as pattern only):" },
          {
            inlineData: {
              data: textureBase64,
              mimeType: textureMimeType,
            },
          },

          // --- BASE IMAGE LAST (forces correct output size) ---
          { text: "BASE ROOM IMAGE (final output MUST match these dimensions):" },
          {
            inlineData: {
              data: originalBase64ImageData,
              mimeType: mimeType,
            },
          },

          // --- PROMPT WITH RULES ---
          { text: prompt }
        ],
      },
    });

    // Extract edited image
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          return part.inlineData.data; // Return Base64 edited image
        }
      }
    }

    throw new Error("No image data returned from Gemini API for texture application.");
  } catch (error) {
    console.error("Error applying texture with Gemini API:", error);
    throw new Error(`Failed to apply texture: ${error instanceof Error ? error.message : String(error)}`);
  }
}



