import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem, IconButton } from '@react-native-material/core';
import { IWithLanguageProviderProps, LevelSize } from '../../lib/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ISettingsProps {
  settings: {
    levelSize: LevelSize;
  };
  onLevelSizePress: () => void;
  onDownloadBackupPress: () => void;
}

const Settings: React.FC<IWithLanguageProviderProps<ISettingsProps>> = ({
  settings,
  onLevelSizePress,
  languageProvider,
  onDownloadBackupPress,
}) => {
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
    </>
  );
};

export default memo(Settings);
