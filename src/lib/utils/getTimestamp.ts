function getTimestamp(date?: Date): number {
  return Math.round((date ? date.valueOf() : Date.now()) / 1000);
}

export default getTimestamp;
