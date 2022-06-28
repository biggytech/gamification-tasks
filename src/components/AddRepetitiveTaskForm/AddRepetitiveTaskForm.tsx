import React, { memo, useCallback, useState } from 'react';
import { IRepetitiveTaskData } from '../../lib/types';
import { Stack, TextInput, Button } from '@react-native-material/core';

interface IAddRepetitiveTaskFormProps {
  onSubmit: (label: IRepetitiveTaskData) => void;
}

interface IAddRepetitiveTaskFormInternalState extends IRepetitiveTaskData {}

const AddRepetitiveTaskForm: React.FC<IAddRepetitiveTaskFormProps> = ({
  onSubmit,
}) => {
  const [state, setState] = useState<IAddRepetitiveTaskFormInternalState>({
    title: 'Task',
    value: 1,
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

export default memo(AddRepetitiveTaskForm);
