function getTimestamp(): number {
  return Math.round(Date.now() / 1000);
}

export default getTimestamp;
