export function getFileSizeBucket(bytes: number): string {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  if (mb >= 10) {
    return "10mb+";
  }
  if (mb >= 5) {
    return "5-10mb";
  }
  if (mb >= 1) {
    return "1-5mb";
  }
  if (kb >= 500) {
    return "500kb-1mb";
  }
  if (kb >= 100) {
    return "100-500kb";
  }
  return "<100kb";
}
