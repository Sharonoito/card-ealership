'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { getCarUploadsDir } from './carUploadPaths';

const maxImageBytes = 6 * 1024 * 1024;
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

function isImageFile(file: File) {
  return typeof file.type === 'string' && allowedImageTypes.has(file.type);
}

function safeExtFromMime(mime: string) {
  const m = mime.toLowerCase();
  if (m.includes('jpeg') || m.includes('jpg')) return 'jpg';
  if (m.includes('png')) return 'png';
  if (m.includes('webp')) return 'webp';
  return 'jpg';
}

function hasValidImageSignature(bytes: Uint8Array, mime: string) {
  if (mime === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mime === 'image/png') {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (mime === 'image/webp') {
    const riff = String.fromCharCode(...bytes.slice(0, 4));
    const webp = String.fromCharCode(...bytes.slice(8, 12));
    return riff === 'RIFF' && webp === 'WEBP';
  }

  return false;
}

export async function saveCarImageFilesToPublicCars(files: File[]): Promise<string[]> {
  // Destination: uploads/cars
  // Public URL: /uploads/cars/<filename>
  const uploadsDir = getCarUploadsDir();

  await fs.mkdir(uploadsDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (file.size > maxImageBytes) continue;
    if (!isImageFile(file)) continue;

    const ext = safeExtFromMime(file.type);
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasValidImageSignature(bytes, file.type)) continue;

    const filename = `car-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const fullPath = path.join(uploadsDir, filename);

    await fs.writeFile(fullPath, bytes);

    urls.push(`/uploads/cars/${filename}`);
  }

  return urls;
}


