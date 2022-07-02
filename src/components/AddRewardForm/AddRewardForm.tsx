import React, { memo, useCallback, useState } from 'react';
import { IRewardData } from '../../lib/types';
import {
  Stack,
  TextInput,
  Button,
  ListItem,
} from '@react-native-material/core';
import appLanguageProvider from '../../data/appLanguageProvider';

interface IAddRewardFormProps {
  onSubmit: (label: IRewardData) => void;
  level: number;
}

interface IAddRewardFormInternalState extends IRewardData {}

const AddRewardForm: React.FC<IAddRewardFormProps> = ({ onSubmit, level }) => {
  const [state, setState] = useState<IAddRewardFormInternalState>({
    title: appLanguageProvider.translate('reward.name.single'),
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
        label={appLanguageProvider.translate('general.title')}
        variant="standard"
        onChangeText={handleTitleChange}
        autoFocus
      />

      <Button
        title={appLanguageProvider.translate('general.submit')}
        onPress={handleSubmitPress}
      />
    </Stack>
  );
};

export default memo(AddRewardForm);
