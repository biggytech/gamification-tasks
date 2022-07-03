import appLanguageProvider from '../data/appLanguageProvider';
import { IAchievement, Key } from '../lib/types';

const achievementsLanguageProvider = appLanguageProvider;

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
    title: achievementsLanguageProvider.translate('achievements.1.title'),
    message: achievementsLanguageProvider.translate('achievements.1.message'),
    condition: {
      level: 10,
      tasks: null,
    },
  },
  [2]: {
    id: 2,
    title: achievementsLanguageProvider.translate('achievements.2.title'),
    message: achievementsLanguageProvider.translate('achievements.2.message'),
    condition: {
      level: null,
      tasks: 10,
    },
  },
};

export default achievements;
