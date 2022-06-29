import React, { memo, useCallback, useState } from 'react';
import { ISubtaskData, Key } from '../../lib/types';
import { Stack, TextInput, Button, Text } from '@react-native-material/core';

interface IAddSubtaskFormProps {
  taskId: Key | null;
  onSubmit: (task: ISubtaskData) => void;
  error: string | null;
}

interface IAddSubtaskFormInternalState extends Omit<ISubtaskData, 'taskId'> {
  taskId: Key | null;
}

const AddSubtaskForm: React.FC<IAddSubtaskFormProps> = ({
  taskId,
  onSubmit,
  error,
}) => {
  const [state, setState] = useState<IAddSubtaskFormInternalState>({
    title: 'Subtask',
    value: 5,
    taskId,
  });

  const handleTitleChange = useCallback((text: string) => {
    setState(st => ({ ...st, title: text }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    if (state.taskId !== null) {
      onSubmit({
        title: state.title,
        value: state.value,
        taskId: state.taskId,
      });
    }
  }, [onSubmit, state.taskId, state.title, state.value]);

  const handleValueChange = useCallback((value: string) => {
    setState(st => ({ ...st, value: Number(value) }));
  }, []);

  return (
    <Stack spacing={4} m={4}>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <TextInput
            value={state.title}
            label="Subtask title"
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
        </>
      ) : null}
    </Stack>
  );
};

export default memo(AddSubtaskForm);
