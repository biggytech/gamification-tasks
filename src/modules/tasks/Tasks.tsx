import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ITaskData, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import TasksList from '../../components/TasksList';
import AddTaskForm from '../../components/AddTaskForm';

const Stack = createNativeStackNavigator();

const tasksDataSource = appDataSource;

const screens = {
  TasksList: 'TasksList',
  AddTaskForm: 'AddTaskForm',
};

type TasksModuleData = Pick<
  IAppData,
  'tasks' | 'labels' | 'unusedLabels' | 'error'
>;
type TasksModuleActions = keyof typeof tasksDataSource.actions;

const TasksModule: ModuleComponent<TasksModuleData, TasksModuleActions> = ({
  data,
  callDispatch,
  actions,
  navigation,
}) => {
  const { tasks, labels, unusedLabels, error } = data;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await callDispatch(actions.LOAD_LABELS);
        await callDispatch(actions.LOAD_UNUSED_LABELS);
        await callDispatch(actions.LOAD_TASKS);
      })();

      return async () => {
        await callDispatch(actions.CLEAR_TASKS);
        await callDispatch(actions.CLEAR_LABELS);
      };
    }, [
      callDispatch,
      actions.LOAD_LABELS,
      actions.LOAD_UNUSED_LABELS,
      actions.LOAD_TASKS,
      actions.CLEAR_TASKS,
      actions.CLEAR_LABELS,
    ]),
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate(screens.AddTaskForm);
  }, [navigation]);

  const handleTaskAdd = useCallback(
    async (label: ITaskData) => {
      await callDispatch(actions.ADD_TASK, label);

      navigation.navigate(screens.TasksList);
      await callDispatch(actions.LOAD_UNUSED_LABELS);
    },
    [actions.ADD_TASK, actions.LOAD_UNUSED_LABELS, callDispatch, navigation],
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.TasksList}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: 'Tasks',
          }}>
          {props => (
            <TasksList
              {...props}
              error={error ?? (labels.length === 0 ? 'Add labels first' : null)}
              items={tasks}
              onAddPress={handleAddPress}
              labels={labels}
              canAdd={unusedLabels.length > 0}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddTaskForm}
          options={{ title: 'Add a Task' }}>
          {props => (
            <AddTaskForm
              {...props}
              onSubmit={handleTaskAdd}
              labels={unusedLabels}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<TasksModuleData, TasksModuleActions>(
  TasksModule,
  {
    title: 'Tasks',
    name: 'TasksModule',
  },
  tasksDataSource,
);
