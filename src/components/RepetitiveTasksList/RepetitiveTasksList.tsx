import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import {
  IRepetitiveTaskWithAdditions,
  IWithColorsProviderProps,
  IWithLanguageProviderProps,
  Key,
} from '../../lib/types';
import { IconButton, ListItem, Stack } from '@react-native-material/core';
import { Button } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IRepetitiveTasksListProps {
  items: IRepetitiveTaskWithAdditions[];
  onAddPress: () => void;
  error: null | string;
  onItemCheckPress: (id: Key) => void;
}

const RepetitiveTasksList: React.FC<
  IWithColorsProviderProps<
    IWithLanguageProviderProps<IRepetitiveTasksListProps>
  >
> = ({
  items,
  onAddPress,
  error,
  onItemCheckPress,
  languageProvider,
  colorsProvider,
}) => {
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
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                leading={
                  <View>
                    <Text>{item.value}</Text>
                  </View>
                }
                trailing={
                  <Stack direction="row" spacing={4} m={4} center>
                    <View>
                      <Text>{item.countCompletedToday}</Text>
                    </View>
                    <IconButton
                      onPress={() => onItemCheckPress(item.id)}
                      icon={props => (
                        <Icon
                          name={
                            item.countCompletedToday >= 2
                              ? 'check-all'
                              : 'check-bold'
                          }
                          {...props}
                          color={
                            item.countCompletedToday >= 1
                              ? colorsProvider.success
                              : undefined
                          }
                        />
                      )}
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
