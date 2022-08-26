import appRepository from '../../appRepository';
import updateStats from '../../handlers/common/updateStats';
import showGlobalMessage from '../../handlers/common/showGlobalMessage';
import writeToHistory from '../../handlers/common/writeToHistory';
import appLanguageProvider from '../../appLanguageProvider';
import appSoundProvider from '../../appSoundProvider';
import getTimestamp from '../../../lib/utils/getTimestamp';
import showGlobalRevertableMessage from '../../handlers/common/showGlobalRevertableMessage';
import { Key } from '../../../lib/types';
import getNewLevelMessage from '../common/getNewLevelMessage';

async function completeRepetitiveTask(id: Key): Promise<boolean> {
  return new Promise(async resolve => {
    const task = await appRepository.getRepetitiveTask(id);
    if (task) {
      const onComplete = async () => {
        const { shouldBumpLevel, level } = await updateStats(task.value);
        await appRepository.addRepetitiveTaskHistory({
          repetitiveTaskId: task.id,
          timestamp: getTimestamp(),
        });

        await writeToHistory(
          `${appLanguageProvider.translate(
            'general.completed',
          )} ${appLanguageProvider
            .translate('repetitiveTask.name.single')
            .toLowerCase()} "${task?.title}"`,
          task.value,
        );

        if (shouldBumpLevel) {
          await writeToHistory(
            `${appLanguageProvider.translate(
              'level.reached',
            )} ${appLanguageProvider
              .translate('level.name')
              .toLowerCase()} ${level}`,
            0,
          );
          showGlobalMessage(getNewLevelMessage(level));
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // set to the beginning of the day
        await appRepository.clearOldestRepetitiveTasksHistory(
          getTimestamp(today),
        );
        resolve(true);
      };

      showGlobalRevertableMessage({
        type: 'revertable',
        title: appLanguageProvider.translate('general.completed') + '!',
        soundFile: appSoundProvider.soundFiles.notification_1,
        onComplete,
        onRevert: () => resolve(false),
        revertSoundFile: appSoundProvider.soundFiles.notification_4,
      });
    } else {
      resolve(false);
    }
  });
}

export default completeRepetitiveTask;
