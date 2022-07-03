import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ModuleComponent } from '../../lib/types';
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

const Stack = createNativeStackNavigator();

const developerSettingsDataSource = appDataSource;
const developerSettingsLanguageProvider = appLanguageProvider;

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    developerSettingsLanguageProvider,
  );

const DeveloperSettingsWithLanguageProvider =
  withLanguageProvider<IDeveloperSettingsProps>(
    DeveloperSettings,
    developerSettingsLanguageProvider,
  );

const screens = {
  DeveloperSettings: 'DeveloperSettings',
};

type DeveloperSettingsModuleData = Pick<IAppData, 'dbSize'>;
type DeveloperSettingsModuleActions =
  keyof typeof developerSettingsDataSource.actions;

const DeveloperSettingsModule: ModuleComponent<
  DeveloperSettingsModuleData,
  DeveloperSettingsModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { dbSize } = data;

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
            <DeveloperSettingsWithLanguageProvider
              {...props}
              dbSize={dbSize}
              onDeleteDatabase={handleDeleteDatabase}
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
