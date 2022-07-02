import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';
import { IconButton } from '@react-native-material/core';
import appLanguageProvider from '../../data/appLanguageProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <ListItem
        title={appLanguageProvider.translate('settings.databaseSize')}
        trailing={() => <Text>{dbSize}</Text>}
      />
      <ListItem
        title={appLanguageProvider.translate('settings.deleteDatabase')}
        trailing={() => (
          <IconButton
            onPress={onDeleteDatabase}
            icon={props => <Icon name="trash-can" {...props} />}
          />
        )}
      />
    </>
  );
};

export default memo(DeveloperSettings);
