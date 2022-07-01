import { IAchievement, Key } from '../lib/types';

type IAchievementWithCondition = Omit<
  IAchievement,
  'completed' | 'timestamp'
> & {
  condition: {
    level: number | null;
    tasks: number | null;
  };
};

const achievements: { [key: Key]: IAchievementWithCondition } = {
  [1]: {
    id: 1,
    title: 'Reach 10th level',
    message: 'Reach 10th level to complete this achievement.',
    condition: {
      level: 10,
      tasks: null,
    },
  },
  [2]: {
    id: 2,
    title: 'Complete 10 tasks',
    message: 'Complete 10 tasks to complete this achievement.',
    condition: {
      level: null,
      tasks: 10,
    },
  },
};

export default achievements;
