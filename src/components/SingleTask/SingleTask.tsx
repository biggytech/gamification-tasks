import {
  Button,
  IconButton,
  ListItem,
  Stack,
  Text,
} from '@react-native-material/core';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, SafeAreaView } from 'react-native';
import {
  ILabel,
  ISubtask,
  ITaskWithAdditions,
  IWithLanguageProviderProps,
  Key,
} from '../../lib/types';
import DraggableFlatList, {
  OpacityDecorator,
} from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

export interface ISingleTaskProps {
  task: ITaskWithAdditions | null;
  error: string | null;
  labels: ILabel[];
  onAddSubtaskPress: () => void;
  onSubtasksOrderChange: (from: number, to: number) => void;
  onSubtaskCompletePress: (id: Key) => void;
  onCompletePress: () => void;
}

const styles = StyleSheet.create({
  labelColor: {
    width: 20,
    height: 20,
    borderWidth: 1,
  },
  view: {
    height: '100%',
  },
  listView: {
    flexShrink: 1,
  },
});

const SingleTask: React.FC<IWithLanguageProviderProps<ISingleTaskProps>> = ({
  task,
  error,
  labels,
  onAddSubtaskPress,
  onSubtasksOrderChange,
  onSubtaskCompletePress,
  onCompletePress,
  languageProvider,
}) => {
  // internal state to avoid blinking subtasks when reordering
  const [internalTask, setInternalTask] = useState<ITaskWithAdditions | null>(
    task,
  );

  useEffect(() => {
    setInternalTask(task);
  }, [task]);

  const label = useMemo(
    () => labels.find(_label => _label.id === internalTask?.labelId),
    [labels, internalTask?.labelId],
  );

  const handleSubtasksReorder = useCallback(
    ({ from, to, data }: { from: number; to: number; data: ISubtask[] }) => {
      setInternalTask(st => (st ? { ...st, subtasks: data } : st));
      onSubtasksOrderChange(from, to);
    },
    [onSubtasksOrderChange],
  );

  const handleCompletePress = useCallback(() => {
    Alert.alert(
      languageProvider.translate('task.completeWarning'),
      languageProvider.translate('task.completeWarningMessage'),
      [
        {
          text: languageProvider.translate('general.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: languageProvider.translate('general.ok'),
          onPress: () => onCompletePress(),
        },
      ],
    );
  }, [onCompletePress, languageProvider]);

  return (
    <SafeAreaView>
      {error ? <Text>{error}</Text> : null}
      {!error && internalTask ? (
        <Stack spacing={4} m={4} style={styles.view}>
          <ListItem
            title={languageProvider.translate('general.title')}
            secondaryText={internalTask.title}
          />
          <ListItem
            title={languageProvider.translate('general.xpValue')}
            secondaryText={internalTask.value.toString()}
          />
          {label ? (
            <ListItem
              title={languageProvider.translate('category.name.single')}
              trailing={
                <View
                  style={[styles.labelColor, { backgroundColor: label.color }]}
                />
              }
              secondaryText={label.name}
            />
          ) : null}
          {!internalTask.completed ? (
            <Button
              title={languageProvider.translate('task.complete')}
              onPress={handleCompletePress}
            />
          ) : null}

          <Text variant="h4">
            {languageProvider.translate('subtask.name.multiple')}
          </Text>

          {internalTask.completed ? (
            <FlatList
              data={internalTask.subtasks}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  leading={
                    <View>
                      <Text>{item.value}</Text>
                    </View>
                  }
                  trailing={
                    <IconButton
                      disabled
                      icon={props =>
                        item.completed ? (
                          <Icon name="check-outline" {...props} />
                        ) : null
                      }
                    />
                  }
                />
              )}
            />
          ) : (
            <>
              <View style={styles.listView}>
                <DraggableFlatList
                  data={internalTask.subtasks}
                  keyExtractor={item => item.id.toString()}
                  onDragEnd={handleSubtasksReorder}
                  renderItem={({ item, drag, isActive }) => (
                    <OpacityDecorator>
                      <ListItem
                        key={item.id}
                        title={item.title}
                        leading={
                          <View>
                            <Text>{item.value}</Text>
                          </View>
                        }
                        trailing={
                          <IconButton
                            disabled={item.completed}
                            onPress={() => onSubtaskCompletePress(item.id)}
                            icon={props =>
                              item.completed ? (
                                <Icon name="check-outline" {...props} />
                              ) : (
                                <Icon name="check-bold" {...props} />
                              )
                            }
                          />
                        }
                        onLongPress={drag}
                        disabled={isActive}
                      />
                    </OpacityDecorator>
                  )}
                />
              </View>

              <Button
                title={
                  languageProvider.translate('general.add') +
                  ' ' +
                  languageProvider
                    .translate('subtask.name.single')
                    .toLowerCase()
                }
                onPress={onAddSubtaskPress}
              />
            </>
          )}
        </Stack>
      ) : null}
    </SafeAreaView>
  );
};

export default memo(SingleTask);
