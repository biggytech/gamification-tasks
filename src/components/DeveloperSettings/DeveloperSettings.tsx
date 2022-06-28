import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

interface IDeveloperSettingsProps {
  dbSize: number;
  onDeleteDatabase: () => void;
}

const DeveloperSettings: React.FC<IDeveloperSettingsProps> = ({
  dbSize,
  onDeleteDatabase,
}) => {
  return (
    <>
      <ListItem title="Database size" trailing={() => <Text>{dbSize}</Text>} />
      <ListItem
        title="Delete database"
        trailing={() => <Button title="DEL" onPress={onDeleteDatabase} />}
      />
    </>
  );
};

export default memo(DeveloperSettings);
