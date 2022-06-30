import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from '@react-native-material/core';
import modules from './src/config/modules';
import appRepository from './src/data/appRepository';
import Navigation from './src/Navigation';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

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
    <GestureHandlerRootView style={styles.rootView}>
      <Navigation modules={modules} />
      <Toast />
    </GestureHandlerRootView>
  ) : (
    <ActivityIndicator />
  );
};

export default App;
