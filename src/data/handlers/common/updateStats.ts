import appRepository from '../../appRepository';

async function updateStats(value: number): Promise<boolean> {
  const prevStats = await appRepository.getStats();
  const settings = await appRepository.getSettings();
  const newPoints = prevStats.points + value;
  const shouldBumpLevel = newPoints > prevStats.nextLevelSize;

  const stats = await appRepository.changeStats({
    level: shouldBumpLevel ? prevStats.level + 1 : prevStats.level,
    points: newPoints,
    nextLevelSize: shouldBumpLevel
      ? prevStats.nextLevelSize + settings.levelSize
      : prevStats.nextLevelSize,
    prevLevelSize: shouldBumpLevel ? newPoints : prevStats.prevLevelSize,
  });
  await appRepository.changeStats(stats);

  return shouldBumpLevel;
}

export default updateStats;
