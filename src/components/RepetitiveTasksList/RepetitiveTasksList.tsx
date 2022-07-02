import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IRepetitiveTask, Key } from '../../lib/types';
import { IconButton, ListItem, Stack } from '@react-native-material/core';
import { Button } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appLanguageProvider from '../../data/appLanguageProvider';

interface RepetitiveTasksListProps {
  items: IRepetitiveTask[];
  onAddPress: () => void;
  error: null | string;
  onItemCheckPress: (id: Key) => void;
}

const RepetitiveTasksList: React.FC<RepetitiveTasksListProps> = ({
  items,
  onAddPress,
  error,
  onItemCheckPress,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button
            title={
              appLanguageProvider.translate('general.add') +
              ' ' +
              appLanguageProvider
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
