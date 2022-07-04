import BACKUP_FILE_EXTENSION from '../../../config/backupFileExtension';
import appFileSystemProvider from '../../appFileSystemProvider';
import appLanguageProvider from '../../appLanguageProvider';
import appRepository from '../../appRepository';
import appSoundProvider from '../../appSoundProvider';
import showGlobalMessage from '../common/showGlobalMessage';

async function loadBackupFile() {
  const backupData = await appRepository.getBackupData();
  const isSuccessfullySaved =
    await appFileSystemProvider.saveFileToSharedDirectory(
      appFileSystemProvider.locations.documents,
      `gamification_bkp_${Date.now()}.${BACKUP_FILE_EXTENSION}`,
      JSON.stringify(backupData),
    );
  if (isSuccessfullySaved) {
    showGlobalMessage({
      type: 'success',
      title: appLanguageProvider.translate('settings.backupSaved'),
      message: appLanguageProvider.translate('settings.backupSavedMessage'),
      soundFile: appSoundProvider.soundFiles.notification_1,
    });
  } else {
    showGlobalMessage({
      type: 'error',
      title: appLanguageProvider.translate('settings.backupNotSaved'),
      message: appLanguageProvider.translate('settings.backupNotSavedMessage'),
      soundFile: appSoundProvider.soundFiles.notification_4,
    });
  }
}

export default loadBackupFile;
