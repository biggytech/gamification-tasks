import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { LevelSize, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import Settings from '../../components/Settings';
import EditLevelSizeForm from '../../components/EditLevelSizeForm';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator();

const settingsDataSource = appDataSource;

const screens = {
  Settings: 'Settings',
  EditLevelSizeForm: 'EditLevelSizeForm',
};

type SettingsModuleData = Pick<IAppData, 'settings'>;
type SettingsModuleActions = keyof typeof settingsDataSource.actions;

const SettingsModule: ModuleComponent<
  SettingsModuleData,
  SettingsModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { settings } = data;

  useFocusEffect(
    useCallback(() => {
      callDispatch(actions.LOAD_SETTINGS);
    }, [actions.LOAD_SETTINGS, callDispatch]),
  );

  const handleLevelSizeChange = useCallback(
    async (levelSize: LevelSize) => {
      await callDispatch(actions.CHANGE_LEVEL_SIZE, levelSize);
      navigation.navigate(screens.Settings);
    },
    [actions.CHANGE_LEVEL_SIZE, callDispatch, navigation],
  );

  const handleLevelSizePress = useCallback(() => {
    Alert.alert(
      'Caution!',
      `Changing this setting will reset your current level progress. 
    Your level and gained XP will stay the same, but the level progress bar will be set to zero. Are you sure to proceed?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate(screens.EditLevelSizeForm),
        },
      ],
    );
  }, [navigation]);

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.Settings}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: 'Settings',
          }}>
          {props => (
            <Settings
              {...props}
              settings={settings}
              onLevelSizePress={handleLevelSizePress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.EditLevelSizeForm}
          options={{ title: 'Edit Level Size' }}>
          {props => (
            <EditLevelSizeForm
              {...props}
              levelSize={settings.levelSize}
              onSubmit={handleLevelSizeChange}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<SettingsModuleData, SettingsModuleActions>(
  SettingsModule,
  {
    title: 'Settings',
    name: 'SettingsModule',
  },
  settingsDataSource,
);
