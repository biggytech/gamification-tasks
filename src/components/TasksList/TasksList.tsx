import React, { memo } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { ILabel, ITask, Key } from '../../lib/types';
import { IconButton, ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appLanguageProvider from '../../data/appLanguageProvider';

const styles = StyleSheet.create({
  labelColor: {
    width: 20,
    height: 20,
    borderWidth: 1,
  },
});

interface TasksListProps {
  items: ITask[];
  onAddPress: () => void;
  error: null | string;
  labels: ILabel[];
  canAdd: boolean;
  onTaskItemPress: (id: Key) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  items,
  onAddPress,
  error,
  labels,
  canAdd,
  onTaskItemPress,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          {canAdd ? (
            <Button
              title={
                appLanguageProvider.translate('general.add') +
                ' ' +
                appLanguageProvider.translate('task.name.single').toLowerCase()
              }
              onPress={onAddPress}
            />
          ) : null}
          <FlatList
            data={items}
            renderItem={({ item }) => {
              const label = labels.find(_label => _label.id === item.labelId);

              return (
                <ListItem
                  title={item.title}
                  leading={
                    <View
                      style={[
                        styles.labelColor,
                        label?.color ? { backgroundColor: label.color } : {},
                      ]}
                    />
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
                  secondaryText={`${appLanguageProvider.translate(
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
