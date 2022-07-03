import React, { memo } from 'react';
import { Text } from 'react-native';
import { ListItem } from '@react-native-material/core';
import { IconButton } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IWithLanguageProviderProps } from '../../lib/types';

export interface IDeveloperSettingsProps {
  dbSize: number;
  onDeleteDatabase: () => void;
  error: string | null;
}

const DeveloperSettings: React.FC<
  IWithLanguageProviderProps<IDeveloperSettingsProps>
> = ({ dbSize, onDeleteDatabase, languageProvider, error }) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
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
      ) : null}
    </>
  );
};

export default memo(DeveloperSettings);
