import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { IWithColorsProviderProps, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeveloperSettings, {
  IDeveloperSettingsProps,
} from '../../components/DeveloperSettings';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';
import appColorsProvider from '../../data/appColorsProvider';
import withColorsProvider from '../../lib/hoc/withColorsProvider';

const Stack = createNativeStackNavigator();

const developerSettingsDataSource = appDataSource;
const developerSettingsLanguageProvider = appLanguageProvider;
const developerSettingsColorsProvider = appColorsProvider;

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    developerSettingsLanguageProvider,
  );

const DeveloperSettingsWithProviders =
  withColorsProvider<IDeveloperSettingsProps>(
    withLanguageProvider<IWithColorsProviderProps<IDeveloperSettingsProps>>(
      DeveloperSettings,
      developerSettingsLanguageProvider,
    ),
    developerSettingsColorsProvider,
  );

const screens = {
  DeveloperSettings: 'DeveloperSettings',
};

type DeveloperSettingsModuleData = Pick<IAppData, 'dbSize' | 'error'>;
type DeveloperSettingsModuleActions =
  keyof typeof developerSettingsDataSource.actions;

const DeveloperSettingsModule: ModuleComponent<
  DeveloperSettingsModuleData,
  DeveloperSettingsModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { dbSize, error } = data;

  useFocusEffect(
    useCallback(() => {
      callDispatch(actions.GET_DB_SIZE);
    }, [actions.GET_DB_SIZE, callDispatch]),
  );

  const handleDeleteDatabase = useCallback(() => {
    callDispatch(actions.DELETE_DATABASE);
  }, [actions.DELETE_DATABASE, callDispatch]);

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.DeveloperSettings}
          options={{
            headerLeft: () => (
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: developerSettingsLanguageProvider.translate(
              'developerSettings.name',
            ),
          }}>
          {props => (
            <DeveloperSettingsWithProviders
              {...props}
              dbSize={dbSize}
              onDeleteDatabase={handleDeleteDatabase}
              error={error}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<
  DeveloperSettingsModuleData,
  DeveloperSettingsModuleActions
>(
  DeveloperSettingsModule,
  {
    title: developerSettingsLanguageProvider.translate(
      'developerSettings.name',
    ),
    name: 'DeveloperSettingsModule',
  },
  developerSettingsDataSource,
);
