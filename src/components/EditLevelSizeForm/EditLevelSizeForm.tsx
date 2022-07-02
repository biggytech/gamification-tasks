import React, { memo, useCallback, useState } from 'react';
import { Stack, TextInput, Button } from '@react-native-material/core';
import { LevelSize } from '../../lib/types';
import appLanguageProvider from '../../data/appLanguageProvider';

interface IEditLevelSizeFormProps {
  levelSize: LevelSize;
  onSubmit: (levelSize: LevelSize) => void;
}

interface IEditLevelSizeFormInternalState {
  levelSize: LevelSize;
}

const EditLevelSizeForm: React.FC<IEditLevelSizeFormProps> = ({
  levelSize,
  onSubmit,
}) => {
  const [state, setState] = useState<IEditLevelSizeFormInternalState>({
    levelSize,
  });

  const handleLevelSizeChange = useCallback((text: string) => {
    setState(st => ({ ...st, levelSize: Number(text) }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    onSubmit(state.levelSize);
  }, [onSubmit, state.levelSize]);

  return (
    <Stack spacing={4} m={4}>
      <TextInput
        value={state.levelSize.toString()}
        keyboardType="number-pad"
        label={appLanguageProvider.translate('general.xpValue')}
        variant="standard"
        onChangeText={handleLevelSizeChange}
        autoFocus
      />

      <Button
        title={appLanguageProvider.translate('general.submit')}
        onPress={handleSubmitPress}
      />
    </Stack>
  );
};

export default memo(EditLevelSizeForm);
