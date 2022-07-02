import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from '@react-native-material/core';
import modules from './src/config/modules';
import appRepository from './src/data/appRepository';
import Navigation from './src/Navigation';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import asSubscriber from './src/lib/hoc/asSubscriber';
import appEventsProvider from './src/data/appEventsProvider';
import { IGlobalMessage } from './src/lib/types';
import appSoundProvider from './src/data/appSoundProvider';

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

export default asSubscriber(
  App,
  [
    {
      name: appEventsProvider.actions.SHOW_TOAST,
      handler: (globalMessage: IGlobalMessage) => {
        Toast.show({
          type: globalMessage.type,
          text1: globalMessage.title,
          text2: globalMessage.message,
        });
        if (globalMessage.soundFile) {
          appSoundProvider.play(
            globalMessage.soundFile as keyof typeof appSoundProvider.soundFiles,
          );
        }
      },
    },
  ],
  appEventsProvider,
);
