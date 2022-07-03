import React from 'react';
import { ILanguageProvider, IWithLanguageProviderProps } from '../types';

function withLanguageProvider<TComponentProps>(
  Component: React.ComponentType<IWithLanguageProviderProps<TComponentProps>>,
  languageProvider: ILanguageProvider,
) {
  const WithLanguageProviderComponent: React.FC<TComponentProps> = props => {
    return <Component {...props} languageProvider={languageProvider} />;
  };

  return WithLanguageProviderComponent;
}

export default withLanguageProvider;
