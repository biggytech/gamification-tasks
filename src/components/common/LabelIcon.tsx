import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LabelIconProps {
  color: string;
}

const LabelIcon: React.FC<LabelIconProps> = ({ color }) => {
  const isWhite = color.toLowerCase() === '#ffffff';

  return (
    <Icon
      name={isWhite ? 'label-outline' : 'label'}
      color={isWhite ? undefined : color}
      size={20}
    />
  );
};

export default LabelIcon;
