import React from 'react';
import { Button } from '@react-native-material/core';
import { IWithLanguageProviderProps } from '../../lib/types';

export interface IDrawerButtonProps {
  onPress: () => void;
}

const DrawerButton: React.FC<
  IWithLanguageProviderProps<IDrawerButtonProps>
> = ({ onPress, languageProvider }) => {
  return (
    <Button
      title={languageProvider.translate('general.menu')}
      variant="text"
      onPress={onPress}
    />
  );
};

export default DrawerButton;
