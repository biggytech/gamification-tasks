import React from 'react';
import { IColorsProvider, IWithColorsProviderProps } from '../types';

function withColorsProvider<TComponentProps>(
  Component: React.ComponentType<IWithColorsProviderProps<TComponentProps>>,
  colorsProvider: IColorsProvider,
) {
  const WithColorsProviderComponent: React.FC<TComponentProps> = props => {
    return <Component {...props} colorsProvider={colorsProvider} />;
  };

  return WithColorsProviderComponent;
}

export default withColorsProvider;
