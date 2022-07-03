import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import Progress, { IProgressProps } from '../../components/Progress';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';

const Stack = createNativeStackNavigator();

const statsDataSource = appDataSource;
const statsLanguageProvider = appLanguageProvider;

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(DrawerButton, statsLanguageProvider);

const ProgressWithLanguageProvider = withLanguageProvider<IProgressProps>(
  Progress,
  statsLanguageProvider,
);

const screens = {
  StatsScreen: 'StatsScreen',
};

type StatsModuleData = Pick<IAppData, 'stats' | 'history' | 'error'>;
type StatsModuleActions = keyof typeof statsDataSource.actions;

const StatsModule: ModuleComponent<StatsModuleData, StatsModuleActions> = ({
  data,
  callDispatch,
  actions,
  navigation,
}) => {
  const { stats, error, history } = data;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await callDispatch(actions.LOAD_STATS);
        await callDispatch(actions.LOAD_HISTORY);
      })();

      return () => {};
    }, [actions.LOAD_HISTORY, actions.LOAD_STATS, callDispatch]),
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.StatsScreen}
          options={{
            headerLeft: () => (
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: statsLanguageProvider.translate('progress.name'),
          }}>
          {props => (
            <ProgressWithLanguageProvider
              {...props}
              error={error}
              stats={stats}
              history={history}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<StatsModuleData, StatsModuleActions>(
  StatsModule,
  {
    title: statsLanguageProvider.translate('progress.name'),
    name: 'StatsModule',
  },
  statsDataSource,
);
