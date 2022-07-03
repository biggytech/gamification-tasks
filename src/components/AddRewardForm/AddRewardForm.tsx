import React, { memo, useCallback, useState } from 'react';
import { IRewardData, IWithLanguageProviderProps } from '../../lib/types';
import {
  Stack,
  TextInput,
  Button,
  ListItem,
} from '@react-native-material/core';

export interface IAddRewardFormProps {
  onSubmit: (label: IRewardData) => void;
  level: number;
}

interface IAddRewardFormInternalState extends IRewardData {}

const AddRewardForm: React.FC<
  IWithLanguageProviderProps<IAddRewardFormProps>
> = ({ onSubmit, level, languageProvider }) => {
  const [state, setState] = useState<IAddRewardFormInternalState>({
    title: languageProvider.translate('reward.name.single'),
    level,
    picked: false,
  });

  const handleTitleChange = useCallback((text: string) => {
    setState(st => ({ ...st, title: text }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    onSubmit({ title: state.title, level: state.level, picked: state.picked });
  }, [onSubmit, state.title, state.level, state.picked]);

  return (
    <Stack spacing={4} m={4}>
      <ListItem title="Level" secondaryText={state.level.toString()} />
      <TextInput
        value={state.title}
        label={languageProvider.translate('general.title')}
        variant="standard"
        onChangeText={handleTitleChange}
        autoFocus
      />

      <Button
        title={languageProvider.translate('general.submit')}
        onPress={handleSubmitPress}
      />
    </Stack>
  );
};

export default memo(AddRewardForm);
