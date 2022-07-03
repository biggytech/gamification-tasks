import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import {
  IRepetitiveTask,
  IWithLanguageProviderProps,
  Key,
} from '../../lib/types';
import { IconButton, ListItem, Stack } from '@react-native-material/core';
import { Button } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IRepetitiveTasksListProps {
  items: IRepetitiveTask[];
  onAddPress: () => void;
  error: null | string;
  onItemCheckPress: (id: Key) => void;
}

const RepetitiveTasksList: React.FC<
  IWithLanguageProviderProps<IRepetitiveTasksListProps>
> = ({ items, onAddPress, error, onItemCheckPress, languageProvider }) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button
            title={
              languageProvider.translate('general.add') +
              ' ' +
              languageProvider
                .translate('repetitiveTask.name.single')
                .toLowerCase()
            }
            onPress={onAddPress}
          />
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                trailing={
                  <Stack direction="row" spacing={4} m={4} center>
                    <View>
                      <Text>{item.value}</Text>
                    </View>
                    <IconButton
                      onPress={() => onItemCheckPress(item.id)}
                      icon={props => <Icon name="check-bold" {...props} />}
                    />
                  </Stack>
                }
              />
            )}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(RepetitiveTasksList);
