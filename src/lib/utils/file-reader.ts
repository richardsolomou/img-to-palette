/**
 * Reads a file as a data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a file to base64 string (without the data URL prefix)
 */
export async function fileToBase64(file: File): Promise<string> {
  const dataUrl = await readFileAsDataURL(file);
  const base64Data = dataUrl.split(",")[1];

  if (!base64Data) {
    throw new Error("Failed to convert file to base64");
  }

  return base64Data;
}
