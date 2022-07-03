import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';
import { IWithLanguageProviderProps, LevelSize } from '../../lib/types';

export interface ISettingsProps {
  settings: {
    levelSize: LevelSize;
  };
  onLevelSizePress: () => void;
}

const Settings: React.FC<IWithLanguageProviderProps<ISettingsProps>> = ({
  settings,
  onLevelSizePress,
  languageProvider,
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
    </>
  );
};

export default memo(Settings);
