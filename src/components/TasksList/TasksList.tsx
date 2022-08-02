import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import {
  ILabel,
  ITask,
  IWithLanguageProviderProps,
  Key,
} from '../../lib/types';
import { IconButton, ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LabelIcon from '../common/LabelIcon';

export interface ITasksListProps {
  items: ITask[];
  onAddPress: () => void;
  error: null | string;
  labels: ILabel[];
  canAdd: boolean;
  onTaskItemPress: (id: Key) => void;
}

const TasksList: React.FC<IWithLanguageProviderProps<ITasksListProps>> = ({
  items,
  onAddPress,
  error,
  labels,
  canAdd,
  onTaskItemPress,
  languageProvider,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          {canAdd ? (
            <Button
              title={
                languageProvider.translate('general.add') +
                ' ' +
                languageProvider.translate('task.name.single').toLowerCase()
              }
              onPress={onAddPress}
            />
          ) : null}
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const label = labels.find(_label => _label.id === item.labelId);

              return (
                <ListItem
                  title={item.title}
                  leading={
                    label?.color ? <LabelIcon color={label.color} /> : <View />
                  }
                  trailing={
                    item.completed ? (
                      <IconButton
                        disabled
                        icon={props => <Icon name="check-outline" {...props} />}
                      />
                    ) : (
                      <Text>{item.value}</Text>
                    )
                  }
                  secondaryText={`${languageProvider.translate(
                    'category.name.single',
                  )}: ${label?.name}`}
                  onPress={() => onTaskItemPress(item.id)}
                />
              );
            }}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(TasksList);
