export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}
