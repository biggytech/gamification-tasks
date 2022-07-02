import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';
import { LevelSize } from '../../lib/types';
import appLanguageProvider from '../../data/appLanguageProvider';

interface ISettingsProps {
  settings: {
    levelSize: LevelSize;
  };
  onLevelSizePress: () => void;
}

const Settings: React.FC<ISettingsProps> = ({ settings, onLevelSizePress }) => {
  return (
    <>
      <ListItem
        title={appLanguageProvider.translate('general.language')}
        secondaryText={appLanguageProvider.locale}
      />
      <ListItem
        title={appLanguageProvider.translate('settings.levelSize')}
        trailing={() => <Text>{settings.levelSize}</Text>}
        onPress={onLevelSizePress}
      />
    </>
  );
};

export default memo(Settings);
