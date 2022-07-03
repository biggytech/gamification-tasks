import React, { memo, useCallback, useState } from 'react';
import { ISubtaskData, IWithLanguageProviderProps, Key } from '../../lib/types';
import { Stack, TextInput, Button, Text } from '@react-native-material/core';

export interface IAddSubtaskFormProps {
  taskId: Key | null;
  onSubmit: (task: Omit<ISubtaskData, 'position'>) => void;
  error: string | null;
}

interface IAddSubtaskFormInternalState
  extends Omit<ISubtaskData, 'taskId' | 'position'> {
  taskId: Key | null;
}

const AddSubtaskForm: React.FC<
  IWithLanguageProviderProps<IAddSubtaskFormProps>
> = ({ taskId, onSubmit, error, languageProvider }) => {
  const [state, setState] = useState<IAddSubtaskFormInternalState>({
    title: languageProvider.translate('subtask.name.single'),
    value: 5,
    taskId,
    completed: false,
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
        completed: state.completed,
      });
    }
  }, [onSubmit, state.completed, state.taskId, state.title, state.value]);

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
            label={languageProvider.translate('general.title')}
            variant="standard"
            onChangeText={handleTitleChange}
            autoFocus
          />
          <TextInput
            value={state.value.toString()}
            keyboardType="number-pad"
            label={languageProvider.translate('general.xpValue')}
            variant="standard"
            onChangeText={handleValueChange}
          />

          <Button
            title={languageProvider.translate('general.submit')}
            onPress={handleSubmitPress}
          />
        </>
      ) : null}
    </Stack>
  );
};

export default memo(AddSubtaskForm);
