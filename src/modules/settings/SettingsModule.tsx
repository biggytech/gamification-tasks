import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { LevelSize, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import Settings, { ISettingsProps } from '../../components/Settings';
import EditLevelSizeForm, {
  IEditLevelSizeFormProps,
} from '../../components/EditLevelSizeForm';
import { Alert } from 'react-native';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';

const Stack = createNativeStackNavigator();

const settingsDataSource = appDataSource;
const settingsLanguageProvider = appLanguageProvider;

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    settingsLanguageProvider,
  );

const EditLevelSizeFormWithLanguageProvider =
  withLanguageProvider<IEditLevelSizeFormProps>(
    EditLevelSizeForm,
    settingsLanguageProvider,
  );

const SettingsWithLanguageProvider = withLanguageProvider<ISettingsProps>(
  Settings,
  settingsLanguageProvider,
);

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
      settingsLanguageProvider.translate('general.caution') + '!',
      settingsLanguageProvider.translate('settings.changeLevelSizeWarning'),
      [
        {
          text: settingsLanguageProvider.translate('general.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: settingsLanguageProvider.translate('general.ok'),
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
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: settingsLanguageProvider.translate('settings.name'),
          }}>
          {props => (
            <SettingsWithLanguageProvider
              {...props}
              settings={settings}
              onLevelSizePress={handleLevelSizePress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.EditLevelSizeForm}
          options={{
            title: settingsLanguageProvider.translate('settings.editLevelSize'),
          }}>
          {props => (
            <EditLevelSizeFormWithLanguageProvider
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
    title: settingsLanguageProvider.translate('settings.name'),
    name: 'SettingsModule',
  },
  settingsDataSource,
);
