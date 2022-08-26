import { IGlobalMessage } from '../../../lib/types';
import appLanguageProvider from '../../appLanguageProvider';
import appSoundProvider from '../../appSoundProvider';

const getNewLevelMessage = (level: number): IGlobalMessage => ({
  type: 'success',
  title: `${appLanguageProvider.translate(
    'level.name',
  )} ${level} ${appLanguageProvider.translate('level.reached').toLowerCase()}!`,
  message: appLanguageProvider.translate('reward.timeToPick'),
  soundFile: appSoundProvider.soundFiles.notification_2,
});

export default getNewLevelMessage;
