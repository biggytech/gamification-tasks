import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from '@react-native-material/core';
import modules from './src/config/modules';
import appRepository from './src/data/appRepository';
import Navigation from './src/Navigation';
import Toast from 'react-native-toast-message';

const App = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const isOK = await appRepository.prepare();
      if (isOK) {
        setIsAppReady(true);
      }
    })();
  }, []);

  return isAppReady ? (
    <>
      <Navigation modules={modules} />
      <Toast />
    </>
  ) : (
    <ActivityIndicator />
  );
};

export default App;
