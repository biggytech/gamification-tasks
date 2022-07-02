import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import AchievementsList from '../../components/AchievementsList';
import appLanguageProvider from '../../data/appLanguageProvider';

const Stack = createNativeStackNavigator();

const achieventsModuleDataSource = appDataSource;

const screens = {
  AchievementsList: 'AchievementsList',
};

type AchievementsModuleData = Pick<IAppData, 'error' | 'achievements'>;
type AchievementsModuleActions =
  keyof typeof achieventsModuleDataSource.actions;

const AchievementsModule: ModuleComponent<
  AchievementsModuleData,
  AchievementsModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { error, achievements } = data;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await callDispatch(actions.LOAD_ACHIEVEMENTS);
      })();

      return () => {
        callDispatch(actions.CLEAR_ACHIEVEMENTS);
      };
    }, [actions.CLEAR_ACHIEVEMENTS, actions.LOAD_ACHIEVEMENTS, callDispatch]),
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.AchievementsList}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: appLanguageProvider.translate('achievements.name.multiple'),
          }}>
          {props => (
            <AchievementsList {...props} items={achievements} error={error} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<AchievementsModuleData, AchievementsModuleActions>(
  AchievementsModule,
  {
    title: appLanguageProvider.translate('achievements.name.multiple'),
    name: 'AchievementsModule',
  },
  achieventsModuleDataSource,
);
