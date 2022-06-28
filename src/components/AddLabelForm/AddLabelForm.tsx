import React, { memo, useCallback, useState } from 'react';
import { ILabelData } from '../../lib/types';
import { Stack, TextInput, Button } from '@react-native-material/core';
import ColorPicker from 'react-native-wheel-color-picker';

interface IAddLabelFormProps {
  onSubmit: (label: ILabelData) => void;
}

interface IAddLabelFormInternalState extends ILabelData {
  color: string;
}

const AddLabelForm: React.FC<IAddLabelFormProps> = ({ onSubmit }) => {
  const [state, setState] = useState<IAddLabelFormInternalState>({
    name: 'Label',
    color: '#ffffff',
  });

  const handleNameChange = useCallback((text: string) => {
    setState(st => ({ ...st, name: text }));
  }, []);

  const handleSubmitPress = useCallback(() => {
    onSubmit({ name: state.name, color: state.color });
  }, [onSubmit, state.color, state.name]);

  const handleColorChange = useCallback((color: string) => {
    setState(st => ({ ...st, color }));
  }, []);

  return (
    <Stack spacing={4} m={4}>
      <TextInput
        value={state.name}
        label="Label name"
        variant="standard"
        onChangeText={handleNameChange}
        autoFocus
      />
      <Stack>
        <ColorPicker
          color={state.color}
          onColorChangeComplete={handleColorChange}
        />
      </Stack>

      <Button title="Submit" onPress={handleSubmitPress} />
    </Stack>
  );
};

export default memo(AddLabelForm);
