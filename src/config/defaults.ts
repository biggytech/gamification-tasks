const defaults = {
  settings: {
    id: 1,
    levelSize: 300,
  },
  stats: {
    id: 1,
    level: 1,
    points: 0,
  },
  subtasks: {
    position: 1,
  },
  nextRewardLevel: -1,
};

defaults.nextRewardLevel = defaults.stats.level + 1;

export default defaults;
