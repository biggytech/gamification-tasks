import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from '@react-native-material/core';
import modules from './src/config/modules';
import appRepository from './src/data/appRepository';
import Navigation from './src/Navigation';
import Toast, { SuccessToast } from 'react-native-toast-message';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import asSubscriber from './src/lib/hoc/asSubscriber';
import appEventsProvider from './src/data/appEventsProvider';
import { IGlobalMessage, IGlobalMessageRevertable } from './src/lib/types';
import appSoundProvider from './src/data/appSoundProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appColorsProvider from './src/data/appColorsProvider';
import TOAST_VISIBILITY_TIME_MS from './src/config/toastVisibilityTime';

const REVERT_BUTTON_WIDTH = 50;

const iconStyles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: REVERT_BUTTON_WIDTH,
    height: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 0,
    width: REVERT_BUTTON_WIDTH,
    backgroundColor: appColorsProvider.lightNeutral,
  },
});

const toastConfig = {
  revertable: (props: any) => {
    const { props: customProps, ...otherProps } = props;
    const { onLeadingIconPress } = customProps;

    return (
      <SuccessToast
        {...otherProps}
        renderLeadingIcon={() => (
          <View style={iconStyles.view}>
            <TouchableOpacity
              style={iconStyles.button}
              onPress={onLeadingIconPress}>
              <Icon
                name="keyboard-return"
                color={appColorsProvider.error}
                size={20}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    );
  },
};

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
      <Toast config={toastConfig} />
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
          visibilityTime: TOAST_VISIBILITY_TIME_MS,
        });
        appSoundProvider.play(
          globalMessage.soundFile as keyof typeof appSoundProvider.soundFiles,
        );
      },
    },
    {
      name: appEventsProvider.actions.SHOW_REVERTABLE_TOAST,
      handler: (globalMessage: IGlobalMessageRevertable) => {
        const completeTimer = setTimeout(
          globalMessage.onComplete,
          TOAST_VISIBILITY_TIME_MS,
        );

        Toast.show({
          type: globalMessage.type,
          text1: globalMessage.title,
          text2: globalMessage.message,
          props: {
            onLeadingIconPress: () => {
              clearTimeout(completeTimer);
              Toast.hide();
              globalMessage.onRevert();
              appSoundProvider.play(
                globalMessage.revertSoundFile as keyof typeof appSoundProvider.soundFiles,
              );
            },
          },
          visibilityTime: TOAST_VISIBILITY_TIME_MS,
        });
        appSoundProvider.play(
          globalMessage.soundFile as keyof typeof appSoundProvider.soundFiles,
        );
      },
    },
  ],
  appEventsProvider,
);
