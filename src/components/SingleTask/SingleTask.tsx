import { Button, ListItem, Stack, Text } from '@react-native-material/core';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ILabel, ITaskWithAdditions } from '../../lib/types';

interface ISingleTaskProps {
  task: ITaskWithAdditions | null;
  error: string | null;
  labels: ILabel[];
  onAddSubtaskPress: () => void;
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
}) => {
  const label = useMemo(
    () => labels.find(_label => _label.id === task?.labelId),
    [labels, task?.labelId],
  );

  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error && task ? (
        <Stack spacing={4} m={4}>
          <ListItem title="Title" secondaryText={task.title} />
          <ListItem
            title="Value (in experience points)"
            secondaryText={task.value.toString()}
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

          {task.subtasks.map(subtask => (
            <ListItem
              key={subtask.id}
              title={subtask.title}
              trailing={
                <View>
                  <Text>{subtask.value}</Text>
                </View>
              }
            />
          ))}

          <Button title="Add a subtask" onPress={onAddSubtaskPress} />
        </Stack>
      ) : null}
    </>
  );
};

export default memo(SingleTask);
