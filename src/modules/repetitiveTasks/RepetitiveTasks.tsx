import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import {
  IGlobalMessage,
  IRepetitiveTaskData,
  Key,
  ModuleComponent,
  ModuleComponentProps,
} from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import RepetitiveTasksList from '../../components/RepetitiveTasksList';
import AddRepetitiveTaskForm from '../../components/AddRepetitiveTaskForm';
import Toast from 'react-native-toast-message';
import asSubscriber from '../../lib/hoc/asSubscriber';
import eventsProvider from '../../data/providers/EventsProvider/eventsProvider';

const Stack = createNativeStackNavigator();

const repetitiveTasksDataSource = appDataSource;
const repetitiveTasksEventsProvider = eventsProvider;

const screens = {
  RepetitiveTasksList: 'RepetitiveTasksList',
  AddRepetitiveTaskForm: 'AddRepetitiveTaskForm',
};

type RepetitiveTasksModuleData = Pick<IAppData, 'repetitiveTasks' | 'error'>;
type RepetitiveTasksModuleActions =
  keyof typeof repetitiveTasksDataSource.actions;

const RepetitiveTasksModule: ModuleComponent<
  RepetitiveTasksModuleData,
  RepetitiveTasksModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { repetitiveTasks, error } = data;

  useFocusEffect(
    useCallback(() => {
      callDispatch(actions.LOAD_REPETITIVE_TASKS);

      return () => {
        callDispatch(actions.CLEAR_REPETITIVE_TASKS);
      };
    }, [
      actions.CLEAR_REPETITIVE_TASKS,
      actions.LOAD_REPETITIVE_TASKS,
      callDispatch,
    ]),
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate(screens.AddRepetitiveTaskForm);
  }, [navigation]);

  const handleRepetitiveTaskAdd = useCallback(
    async (label: IRepetitiveTaskData) => {
      await callDispatch(actions.ADD_REPETITIVE_TASK, label);
      navigation.navigate(screens.RepetitiveTasksList);
    },
    [actions.ADD_REPETITIVE_TASK, callDispatch, navigation],
  );

  const handleRepetitiveTaskComplete = useCallback(
    async (taskId: Key) => {
      await callDispatch(actions.COMPLETE_REPETITIVE_TASK, taskId);
    },
    [actions.COMPLETE_REPETITIVE_TASK, callDispatch],
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.RepetitiveTasksList}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: 'Repetitive Tasks',
          }}>
          {props => (
            <RepetitiveTasksList
              {...props}
              error={error}
              items={repetitiveTasks}
              onAddPress={handleAddPress}
              onItemCheckPress={handleRepetitiveTaskComplete}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddRepetitiveTaskForm}
          options={{ title: 'Add a Repetitive Task' }}>
          {props => (
            <AddRepetitiveTaskForm
              {...props}
              onSubmit={handleRepetitiveTaskAdd}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<
  RepetitiveTasksModuleData,
  RepetitiveTasksModuleActions
>(
  asSubscriber<
    ModuleComponentProps<
      RepetitiveTasksModuleData,
      RepetitiveTasksModuleActions
    >,
    typeof repetitiveTasksEventsProvider.actions
  >(
    RepetitiveTasksModule,
    [
      {
        name: repetitiveTasksEventsProvider.actions.SHOW_TOAST,
        handler: (globalMessage: IGlobalMessage) => {
          Toast.show({
            type: globalMessage.type,
            text1: globalMessage.title,
            text2: globalMessage.message,
          });
        },
      },
    ],
    repetitiveTasksEventsProvider,
  ),
  {
    title: 'Repetitive Tasks',
    name: 'RepetitiveTasksModule',
  },
  repetitiveTasksDataSource,
);
