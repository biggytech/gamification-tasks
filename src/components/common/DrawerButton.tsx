import React from 'react';
import { Button } from '@react-native-material/core';

interface IDrawerButtonProps {
  onPress: () => void;
}

const DrawerButton: React.FC<IDrawerButtonProps> = ({ onPress }) => {
  return <Button title="Menu" variant="text" onPress={onPress} />;
};

export default DrawerButton;
