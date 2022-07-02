import React from 'react';
import { Button } from '@react-native-material/core';
import appLanguageProvider from '../../data/appLanguageProvider';

interface IDrawerButtonProps {
  onPress: () => void;
}

const DrawerButton: React.FC<IDrawerButtonProps> = ({ onPress }) => {
  return (
    <Button
      title={appLanguageProvider.translate('general.menu')}
      variant="text"
      onPress={onPress}
    />
  );
};

export default DrawerButton;
