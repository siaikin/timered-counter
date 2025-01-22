function uuidPart() {
  return Math.random().toString(36).slice(2, 10);
}

export function uuid() {
  return [uuidPart(), uuidPart(), uuidPart(), uuidPart()].join('-');
}
