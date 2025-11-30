export function isURL(value: string) {
  try {
    const u = new URL(value)
    return Boolean(u.protocol && u.host)
  } catch {
    return false
  }
}
