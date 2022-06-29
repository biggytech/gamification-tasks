import React, { memo, useCallback, useState } from 'react';
import { IRewardData } from '../../lib/types';
import {
  Stack,
  TextInput,
  Button,
  ListItem,
} from '@react-native-material/core';

interface IAddRewardFormProps {
  onSubmit: (label: IRewardData) => void;
  level: number;
}

interface IAddRewardFormInternalState extends IRewardData {}

const AddRewardForm: React.FC<IAddRewardFormProps> = ({ onSubmit, level }) => {
  const [state, setState] = useState<IAddRewardFormInternalState>({
    title: 'Reward',
    level,
  });

  const handleTitleChange = useCallback((text: string) => {
    setState(st => ({ ...st, title: text }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    onSubmit({ title: state.title, level: state.level });
  }, [onSubmit, state.title, state.level]);

  return (
    <Stack spacing={4} m={4}>
      <ListItem title="Level" secondaryText={state.level.toString()} />
      <TextInput
        value={state.title}
        label="Reward title"
        variant="standard"
        onChangeText={handleTitleChange}
        autoFocus
      />

      <Button title="Submit" onPress={handleSubmitPress} />
    </Stack>
  );
};

export default memo(AddRewardForm);
