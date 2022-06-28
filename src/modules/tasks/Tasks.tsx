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

type TasksModuleData = Pick<IAppData, 'tasks' | 'error'>;
type TasksModuleActions = keyof typeof tasksDataSource.actions;

const TasksModule: ModuleComponent<TasksModuleData, TasksModuleActions> = ({
  data,
  callDispatch,
  actions,
  navigation,
}) => {
  const { tasks, error } = data;

  useFocusEffect(
    useCallback(() => {
      callDispatch(actions.LOAD_TASKS);

      return () => {
        callDispatch(actions.CLEAR_TASKS);
      };
    }, [actions.CLEAR_TASKS, actions.LOAD_TASKS, callDispatch]),
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate(screens.AddTaskForm);
  }, [navigation]);

  const handleTaskAdd = useCallback(
    async (label: ITaskData) => {
      await callDispatch(actions.ADD_TASK, label);
      navigation.navigate(screens.TasksList);
    },
    [actions.ADD_TASK, callDispatch, navigation],
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
              error={error}
              items={tasks}
              onAddPress={handleAddPress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddTaskForm}
          options={{ title: 'Add a Task' }}>
          {props => <AddTaskForm {...props} onSubmit={handleTaskAdd} />}
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
