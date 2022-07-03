import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';
import { IconButton } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IWithLanguageProviderProps } from '../../lib/types';

export interface IDeveloperSettingsProps {
  dbSize: number;
  onDeleteDatabase: () => void;
}

const DeveloperSettings: React.FC<
  IWithLanguageProviderProps<IDeveloperSettingsProps>
> = ({ dbSize, onDeleteDatabase, languageProvider }) => {
  return (
    <>
      <ListItem
        title={languageProvider.translate('settings.databaseSize')}
        trailing={() => <Text>{dbSize}</Text>}
      />
      <ListItem
        title={languageProvider.translate('settings.deleteDatabase')}
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
