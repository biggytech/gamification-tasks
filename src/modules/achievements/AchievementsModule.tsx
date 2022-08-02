import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { IWithColorsProviderProps, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import AchievementsList, {
  IAchievementsListProps,
} from '../../components/AchievementsList';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';
import appColorsProvider from '../../data/appColorsProvider';
import withColorsProvider from '../../lib/hoc/withColorsProvider';

const Stack = createNativeStackNavigator();

const achieventsModuleDataSource = appDataSource;
const achievementsLanguageProvider = appLanguageProvider;
const achievementsColorsProviders = appColorsProvider;

const AchievementsListWithProviders =
  withColorsProvider<IAchievementsListProps>(
    withLanguageProvider<IWithColorsProviderProps<IAchievementsListProps>>(
      AchievementsList,
      achievementsLanguageProvider,
    ),
    achievementsColorsProviders,
  );

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    achievementsLanguageProvider,
  );

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
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: achievementsLanguageProvider.translate(
              'achievements.name.multiple',
            ),
          }}>
          {props => (
            <AchievementsListWithProviders
              {...props}
              items={achievements}
              error={error}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<AchievementsModuleData, AchievementsModuleActions>(
  AchievementsModule,
  {
    title: achievementsLanguageProvider.translate('achievements.name.multiple'),
    name: 'AchievementsModule',
  },
  achieventsModuleDataSource,
);
