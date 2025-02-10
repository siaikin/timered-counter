export function parseJsonString(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}
