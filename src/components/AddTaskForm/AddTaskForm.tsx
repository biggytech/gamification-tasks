import React, { memo, useCallback, useState } from 'react';
import { ITaskData } from '../../lib/types';
import { Stack, TextInput, Button } from '@react-native-material/core';

interface IAddTaskFormProps {
  onSubmit: (label: ITaskData) => void;
}

interface IAddTaskFormInternalState extends ITaskData {}

const AddTaskForm: React.FC<IAddTaskFormProps> = ({ onSubmit }) => {
  const [state, setState] = useState<IAddTaskFormInternalState>({
    title: 'Task',
    value: 5,
  });

  const handleTitleChange = useCallback((text: string) => {
    setState(st => ({ ...st, title: text }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    onSubmit({ title: state.title, value: state.value });
  }, [onSubmit, state.title, state.value]);

  const handleValueChange = useCallback((value: string) => {
    setState(st => ({ ...st, value: Number(value) }));
  }, []);

  return (
    <Stack spacing={4} m={4}>
      <TextInput
        value={state.title}
        label="Task title"
        variant="standard"
        onChangeText={handleTitleChange}
        autoFocus
      />
      <TextInput
        value={state.value.toString()}
        keyboardType="number-pad"
        label="Value (in experience points)"
        variant="standard"
        onChangeText={handleValueChange}
      />

      <Button title="Submit" onPress={handleSubmitPress} />
    </Stack>
  );
};

export default memo(AddTaskForm);
