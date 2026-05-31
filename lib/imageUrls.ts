export function normalizeImageUrl(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";

  return trimmed.replace(/^v(?=https?:\/\/)/i, "");
}

export function isSupportedImageUrl(value: string) {
  if (!value) return false;
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isRemoteImageUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}
