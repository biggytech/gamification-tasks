import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  ILabel,
  ITaskData,
  IWithLanguageProviderProps,
  Key,
} from '../../lib/types';
import { Stack, TextInput, Button } from '@react-native-material/core';
import DropDownPicker from 'react-native-dropdown-picker';

export interface IAddTaskFormProps {
  onSubmit: (label: ITaskData) => void;
  labels: ILabel[];
}

interface IAddTaskFormInternalState extends ITaskData {}

const AddTaskForm: React.FC<IWithLanguageProviderProps<IAddTaskFormProps>> = ({
  onSubmit,
  labels,
  languageProvider,
}) => {
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] =
    useState<boolean>(false);

  const [state, setState] = useState<IAddTaskFormInternalState>({
    title: languageProvider.translate('task.name.single'),
    value: 5,
    labelId: labels[0].id,
    completed: false,
  });

  const handleTitleChange = useCallback((text: string) => {
    setState(st => ({ ...st, title: text }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    onSubmit({
      title: state.title,
      value: state.value,
      labelId: state.labelId,
      completed: state.completed,
    });
  }, [onSubmit, state.completed, state.labelId, state.title, state.value]);

  const handleValueChange = useCallback((value: string) => {
    setState(st => ({ ...st, value: Number(value) }));
  }, []);

  const handleLabelIdChange = useCallback(({ value }: { value?: Key }) => {
    if (value !== undefined) {
      setState(st => ({ ...st, labelId: value }));
    }
  }, []);

  const labelsData = useMemo(
    () => labels.map(label => ({ label: label.name, value: label.id })),
    [labels],
  );

  return (
    <Stack spacing={4} m={4}>
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
      <DropDownPicker
        open={isLabelDropdownOpen}
        value={state.labelId}
        items={labelsData}
        setOpen={setIsLabelDropdownOpen}
        onSelectItem={handleLabelIdChange}
        multiple={false}
        setValue={() => {}}
      />

      <Button
        title={languageProvider.translate('general.submit')}
        onPress={handleSubmitPress}
      />
    </Stack>
  );
};

export default memo(AddTaskForm);
