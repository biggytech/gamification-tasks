import React, { memo, useCallback } from 'react';
import { Text } from 'react-native';
import { ListItem, IconButton } from '@react-native-material/core';
import { IWithLanguageProviderProps, LevelSize } from '../../lib/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

export interface ISettingsProps {
  settings: {
    levelSize: LevelSize;
  };
  onLevelSizePress: () => void;
  onDownloadBackupPress: () => void;
  onRestoreFromBackupPress: () => void;
}

const Settings: React.FC<IWithLanguageProviderProps<ISettingsProps>> = ({
  settings,
  onLevelSizePress,
  languageProvider,
  onDownloadBackupPress,
  onRestoreFromBackupPress,
}) => {
  const handleRestoreFromBackupPress = useCallback(() => {
    Alert.alert(
      languageProvider.translate('general.caution'),
      languageProvider.translate('settings.restoreFromBackupMessage'),
      [
        {
          text: languageProvider.translate('general.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: languageProvider.translate('general.ok'),
          onPress: () => onRestoreFromBackupPress(),
        },
      ],
    );
  }, [languageProvider, onRestoreFromBackupPress]);

  return (
    <>
      <ListItem
        title={languageProvider.translate('general.language')}
        secondaryText={languageProvider.locale}
      />
      <ListItem
        title={languageProvider.translate('settings.levelSize')}
        trailing={() => <Text>{settings.levelSize}</Text>}
        onPress={onLevelSizePress}
      />
      <ListItem
        title={languageProvider.translate('settings.downloadBackup')}
        trailing={
          <IconButton
            onPress={onDownloadBackupPress}
            icon={props => <Icon name="download" {...props} />}
          />
        }
      />
      <ListItem
        title={languageProvider.translate('settings.restoreFromBackup')}
        trailing={
          <IconButton
            onPress={handleRestoreFromBackupPress}
            icon={props => <Icon name="upload" {...props} />}
          />
        }
      />
    </>
  );
};

export default memo(Settings);
