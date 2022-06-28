import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeveloperSettings from '../../components/DeveloperSettings';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';

const Stack = createNativeStackNavigator();

const developerSettingsDataSource = appDataSource;

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
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
          }}>
          {props => (
            <DeveloperSettings
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
    title: 'Developer Settings',
    name: 'DeveloperSettingsModule',
  },
  developerSettingsDataSource,
);
