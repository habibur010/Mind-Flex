import fs from "node:fs";
import OpenAI, { toFile } from "openai";
import { Buffer } from "node:buffer";

// Use the standard OPENAI_API_KEY env var (not Replit-proxied)
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * Generate an image and return as Buffer.
 * Uses dall-e-3 via standard OpenAI API.
 */
export async function generateImageBuffer(
  prompt: string,
  size: "1024x1024" | "512x512" | "256x256" = "1024x1024"
): Promise<Buffer> {
  if (!openai) throw new Error("OPENAI_API_KEY is not configured");
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: size === "512x512" || size === "256x256" ? "1024x1024" : size,
    response_format: "b64_json",
  });
  const base64 = response.data[0]?.b64_json ?? "";
  return Buffer.from(base64, "base64");
}

/**
 * Edit/combine multiple images into a composite.
 * Uses dall-e-2 (only model that supports image editing via standard OpenAI API).
 */
export async function editImages(
  imageFiles: string[],
  prompt: string,
  outputPath?: string
): Promise<Buffer> {
  if (!openai) throw new Error("OPENAI_API_KEY is not configured");
  const images = await Promise.all(
    imageFiles.map((file) =>
      toFile(fs.createReadStream(file), file, {
        type: "image/png",
      })
    )
  );

  const response = await openai.images.edit({
    model: "dall-e-2",
    image: images[0],
    prompt,
    response_format: "b64_json",
  });

  const imageBase64 = response.data[0]?.b64_json ?? "";
  const imageBytes = Buffer.from(imageBase64, "base64");

  if (outputPath) {
    fs.writeFileSync(outputPath, imageBytes);
  }

  return imageBytes;
}
