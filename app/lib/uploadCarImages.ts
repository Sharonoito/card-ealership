'use server';

import fs from 'node:fs/promises';
import path from 'node:path';

function isImageFile(file: File) {
  return typeof file.type === 'string' && file.type.startsWith('image/');
}

function safeExtFromMime(mime: string) {
  const m = mime.toLowerCase();
  if (m.includes('jpeg') || m.includes('jpg')) return 'jpg';
  if (m.includes('png')) return 'png';
  if (m.includes('webp')) return 'webp';
  if (m.includes('gif')) return 'gif';
  return 'jpg';
}

export async function saveCarImageFilesToPublicCars(files: File[]): Promise<string[]> {
  // Destination: public/cars
  // Public URL: /cars/<filename>
  const publicCarsDir = path.join(process.cwd(), 'public', 'cars');

  await fs.mkdir(publicCarsDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!isImageFile(file)) continue;

    const ext = safeExtFromMime(file.type);
    const bytes = new Uint8Array(await file.arrayBuffer());

    const filename = `car-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const fullPath = path.join(publicCarsDir, filename);

    await fs.writeFile(fullPath, bytes);

    // Next serves /public at the root
    urls.push(`/cars/${filename}`);
  }

  return urls;
}


