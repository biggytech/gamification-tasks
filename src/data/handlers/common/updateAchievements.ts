import achievements from '../../../config/achievements';
import getTimestamp from '../../../lib/utils/getTimestamp';
import appRepository from '../../appRepository';
import showGlobalMessage from './showGlobalMessage';
import writeToHistory from './writeToHistory';

async function updateAchievements() {
  const stats = await appRepository.getStats();
  const completedTasks = await appRepository.getCompletedTasks();
  const notCompletedAchievements =
    await appRepository.getNotCompletedAchievements();

  await Promise.all(
    notCompletedAchievements.map(async achievement => {
      if (achievements[achievement.id]) {
        const { condition } = achievements[achievement.id];
        let isCompleted = false;

        if (condition.level !== null && stats.level >= condition.level) {
          isCompleted = true;
        } else if (
          condition.tasks !== null &&
          completedTasks.length >= condition.tasks
        ) {
          isCompleted = true;
        }

        if (isCompleted) {
          await appRepository.changeAchievement({
            ...achievement,
            completed: true,
            timestamp: getTimestamp(),
          });
          showGlobalMessage({
            type: 'success',
            title: 'Achievement completed!',
            message: `You have completed achievement "${achievement.title}"`,
          });
          await writeToHistory(
            `You have completed achievement "${achievement.title}"`,
            0,
          );
        }
      }
    }),
  );
}

export default updateAchievements;
