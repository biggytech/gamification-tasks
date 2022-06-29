import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import Progress from '../../components/Progress';

const Stack = createNativeStackNavigator();

const statsDataSource = appDataSource;

const screens = {
  StatsScreen: 'StatsScreen',
};

type StatsModuleData = Pick<IAppData, 'stats' | 'error'>;
type StatsModuleActions = keyof typeof statsDataSource.actions;

const StatsModule: ModuleComponent<StatsModuleData, StatsModuleActions> = ({
  data,
  callDispatch,
  actions,
  navigation,
}) => {
  const { stats, error } = data;

  useFocusEffect(
    useCallback(() => {
      callDispatch(actions.LOAD_STATS);

      return () => {};
    }, [actions.LOAD_STATS, callDispatch]),
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.StatsScreen}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: 'Progress',
          }}>
          {props => <Progress {...props} error={error} stats={stats} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<StatsModuleData, StatsModuleActions>(
  StatsModule,
  {
    title: 'Progress',
    name: 'StatsModule',
  },
  statsDataSource,
);
