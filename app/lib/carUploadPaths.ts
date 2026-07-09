import path from "node:path";

export function getCarUploadsDir() {
  return path.join(process.env.UPLOAD_ROOT || path.join(process.cwd(), "uploads"), "cars");
}
