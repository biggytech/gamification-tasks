import React, { memo, useCallback, useState } from 'react';
import { Stack, TextInput, Button } from '@react-native-material/core';
import { LevelSize } from '../../lib/types';

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
        label="Level size (in experience points)"
        variant="standard"
        onChangeText={handleLevelSizeChange}
        autoFocus
      />

      <Button title="Submit" onPress={handleSubmitPress} />
    </Stack>
  );
};

export default memo(EditLevelSizeForm);
