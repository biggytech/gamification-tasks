import achievements from '../../../config/achievements';
import getTimestamp from '../../../lib/utils/getTimestamp';
import appLanguageProvider from '../../appLanguageProvider';
import appRepository from '../../appRepository';
import appSoundProvider from '../../appSoundProvider';
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
            title:
              appLanguageProvider.translate('achievements.completed') + '!',
            message: `${appLanguageProvider.translate(
              'achievements.completedMessage',
            )} "${achievement.title}"`,
            soundFile: appSoundProvider.soundFiles.notification_3,
          });
          await writeToHistory(
            `${appLanguageProvider.translate(
              'achievements.completedMessage',
            )} "${achievement.title}"`,
            0,
          );
        }
      }
    }),
  );
}

export default updateAchievements;
