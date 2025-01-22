export function polyfillKeyframes(
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
): Keyframe[] {
  if (Array.isArray(keyframes)) {
    return keyframes;
  }

  const properties = Object.keys(keyframes);
  const length = Math.max(
    ...properties.map(property => (keyframes[property] as unknown[]).length),
  );

  const result: Keyframe[] = [];
  for (let i = 0; i < length; i++) {
    const frame: Keyframe = {};
    properties.forEach(property => {
      const values = keyframes[property] as (string | number)[];
      frame[property] =
        values[i] !== undefined ? values[i] : values[values.length - 1];
    });
    result.push(frame);
  }

  return result;
}
