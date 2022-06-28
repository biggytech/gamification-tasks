import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';

interface ISettingsProps {
  settings: {
    levelSize: number;
  };
}

const Settings: React.FC<ISettingsProps> = ({ settings }) => {
  return (
    <>
      <ListItem
        title="Level size"
        trailing={() => <Text>{settings.levelSize}</Text>}
      />
    </>
  );
};

export default memo(Settings);
