import { Point } from '../../../lib/types';
import appRepository from '../../appRepository';

function getStatsToBump({
  points,
  value,
  prevLevelSize,
  nextLevelSize,
  levelSize,
  level,
}: {
  points: Point;
  value: Point;
  prevLevelSize: Point;
  nextLevelSize: Point;
  levelSize: Point;
  level: number;
}): {
  points: Point;
  prevLevelSize: Point;
  nextLevelSize: Point;
  level: number;
} {
  let levelsToBump = 0,
    currPrevLevelSize = prevLevelSize,
    currPoints = points,
    currNextLevelSize = nextLevelSize,
    remainingValue = value;

  while (currPoints + remainingValue > currNextLevelSize) {
    levelsToBump++;
    currPrevLevelSize = currNextLevelSize;
    currPoints += levelSize;
    currNextLevelSize += levelSize;
    remainingValue -= levelSize;
  }

  currPoints += remainingValue;

  return {
    points: currPoints,
    prevLevelSize: currPrevLevelSize,
    nextLevelSize: currNextLevelSize,
    level: level + levelsToBump,
  };
}

async function updateStats(value: number): Promise<{
  shouldBumpLevel: boolean;
  level: number;
}> {
  const prevStats = await appRepository.getStats();
  const settings = await appRepository.getSettings();
  const newPoints = prevStats.points + value;
  const shouldBumpLevel = newPoints > prevStats.nextLevelSize;

  let stats;

  if (shouldBumpLevel) {
    const statsToBump = getStatsToBump({
      points: prevStats.points,
      value,
      prevLevelSize: prevStats.prevLevelSize,
      nextLevelSize: prevStats.nextLevelSize,
      levelSize: settings.levelSize,
      level: prevStats.level,
    });
    stats = await appRepository.changeStats({
      level: statsToBump.level,
      points: statsToBump.points,
      nextLevelSize: statsToBump.nextLevelSize,
      prevLevelSize: statsToBump.prevLevelSize,
    });
  } else {
    stats = await appRepository.changeStats({
      level: prevStats.level,
      points: newPoints,
      nextLevelSize: prevStats.nextLevelSize,
      prevLevelSize: prevStats.prevLevelSize,
    });
  }

  await appRepository.changeStats(stats);

  return {
    shouldBumpLevel,
    level: stats.level,
  };
}

export default updateStats;
