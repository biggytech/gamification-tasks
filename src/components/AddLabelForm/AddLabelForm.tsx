import React, { memo, useCallback, useState } from 'react';
import { ILabelData, IWithLanguageProviderProps } from '../../lib/types';
import { Stack, TextInput, Button } from '@react-native-material/core';
import ColorPicker from 'react-native-wheel-color-picker';

export interface IAddLabelFormProps {
  onSubmit: (label: ILabelData) => void;
}

interface IAddLabelFormInternalState extends ILabelData {
  color: string;
}

const AddLabelForm: React.FC<
  IWithLanguageProviderProps<IAddLabelFormProps>
> = ({ onSubmit, languageProvider }) => {
  const [state, setState] = useState<IAddLabelFormInternalState>({
    name: languageProvider.translate('category.name.single'),
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
        label={languageProvider.translate('general.title')}
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

      <Button
        title={languageProvider.translate('general.submit')}
        onPress={handleSubmitPress}
      />
    </Stack>
  );
};

export default memo(AddLabelForm);
