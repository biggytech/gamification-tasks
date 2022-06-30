import { Button, ListItem, Stack, Text } from '@react-native-material/core';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ILabel, ISubtask, ITaskWithAdditions } from '../../lib/types';
import DraggableFlatList, {
  OpacityDecorator,
} from 'react-native-draggable-flatlist';

interface ISingleTaskProps {
  task: ITaskWithAdditions | null;
  error: string | null;
  labels: ILabel[];
  onAddSubtaskPress: () => void;
  onSubtasksOrderChange: (from: number, to: number) => void;
}

const styles = StyleSheet.create({
  labelColor: {
    width: 20,
    height: 20,
    borderWidth: 1,
  },
});

const SingleTask: React.FC<ISingleTaskProps> = ({
  task,
  error,
  labels,
  onAddSubtaskPress,
  onSubtasksOrderChange,
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

  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error && internalTask ? (
        <Stack spacing={4} m={4}>
          <ListItem title="Title" secondaryText={internalTask.title} />
          <ListItem
            title="Value (in experience points)"
            secondaryText={internalTask.value.toString()}
          />
          {label ? (
            <ListItem
              title="Label"
              trailing={
                <View
                  style={[styles.labelColor, { backgroundColor: label.color }]}
                />
              }
              secondaryText={label.name}
            />
          ) : null}

          <Text variant="h4">Subtasks</Text>

          <DraggableFlatList
            data={internalTask.subtasks}
            keyExtractor={item => item.id.toString()}
            onDragEnd={handleSubtasksReorder}
            renderItem={({ item, drag, isActive }) => (
              <OpacityDecorator>
                <ListItem
                  key={item.id}
                  title={item.title}
                  trailing={
                    <View>
                      <Text>{item.value}</Text>
                    </View>
                  }
                  onLongPress={drag}
                  disabled={isActive}
                />
              </OpacityDecorator>
            )}
          />

          <Button title="Add a subtask" onPress={onAddSubtaskPress} />
        </Stack>
      ) : null}
    </>
  );
};

export default memo(SingleTask);
