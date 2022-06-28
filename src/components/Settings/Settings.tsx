import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';

interface ISettingsProps {
  settings: {
    levelSize: number;
  };
  onLevelSizePress: () => void;
}

const Settings: React.FC<ISettingsProps> = ({ settings, onLevelSizePress }) => {
  return (
    <>
      <ListItem
        title="Level size"
        trailing={() => <Text>{settings.levelSize}</Text>}
        onPress={onLevelSizePress}
      />
    </>
  );
};

export default memo(Settings);
