import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { ISubtaskData, ITaskData, Key, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import TasksList from '../../components/TasksList';
import AddTaskForm from '../../components/AddTaskForm';
import SingleTask from '../../components/SingleTask';
import AddSubtaskForm from '../../components/AddSubtaskForm';
import appLanguageProvider from '../../data/appLanguageProvider';

const Stack = createNativeStackNavigator();

const tasksDataSource = appDataSource;

const screens = {
  TasksList: 'TasksList',
  AddTaskForm: 'AddTaskForm',
  SingleTask: 'SingleTask',
  AssSubtaskForm: 'AssSubtaskForm',
};

type TasksModuleData = Pick<
  IAppData,
  'tasks' | 'labels' | 'unusedLabels' | 'error' | 'selectedTask'
>;
type TasksModuleActions = keyof typeof tasksDataSource.actions;

const TasksModule: ModuleComponent<TasksModuleData, TasksModuleActions> = ({
  data,
  callDispatch,
  actions,
  navigation,
}) => {
  const { tasks, labels, unusedLabels, error, selectedTask } = data;

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
    async (task: ITaskData) => {
      await callDispatch(actions.ADD_TASK, task);

      navigation.navigate(screens.TasksList);
      await callDispatch(actions.LOAD_UNUSED_LABELS);
    },
    [actions.ADD_TASK, actions.LOAD_UNUSED_LABELS, callDispatch, navigation],
  );

  const handleTaskItemPress = useCallback(
    async (taskId: Key) => {
      await callDispatch(actions.LOAD_SELECTED_TASK, taskId);
      navigation.navigate(screens.SingleTask);
    },
    [actions.LOAD_SELECTED_TASK, callDispatch, navigation],
  );

  const handleAddSubtaskPress = useCallback(() => {
    navigation.navigate(screens.AssSubtaskForm);
  }, [navigation]);

  const handleAddSubtask = useCallback(
    async (subtask: Omit<ISubtaskData, 'position'>, goBack: () => void) => {
      await callDispatch(actions.ADD_SUBTASK, subtask);
      goBack();
    },
    [actions.ADD_SUBTASK, callDispatch],
  );

  const handleSubtasksOrderChange = useCallback(
    async (from: number, to: number) => {
      await callDispatch(actions.CHANGE_SUBTASKS_ORDER, { from, to });
      if (selectedTask) {
        await callDispatch(actions.LOAD_SELECTED_TASK, selectedTask.id);
      }
    },
    [
      actions.CHANGE_SUBTASKS_ORDER,
      actions.LOAD_SELECTED_TASK,
      callDispatch,
      selectedTask,
    ],
  );

  const handleSubtaskComplete = useCallback(
    (id: Key) => {
      callDispatch(actions.COMPLETE_SUBTASK, id);
    },
    [actions.COMPLETE_SUBTASK, callDispatch],
  );

  const handleTaskComplete = useCallback(async () => {
    await callDispatch(actions.COMPLETE_TASK);
    await callDispatch(actions.LOAD_TASKS);
    await callDispatch(actions.LOAD_UNUSED_LABELS);
  }, [
    actions.COMPLETE_TASK,
    actions.LOAD_TASKS,
    actions.LOAD_UNUSED_LABELS,
    callDispatch,
  ]);

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.TasksList}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: appLanguageProvider.translate('task.name.multiple'),
          }}>
          {props => (
            <TasksList
              {...props}
              error={
                error ??
                (labels.length === 0
                  ? appLanguageProvider.translate('task.addCategoriesFirst')
                  : null)
              }
              items={tasks}
              onAddPress={handleAddPress}
              labels={labels}
              canAdd={unusedLabels.length > 0}
              onTaskItemPress={handleTaskItemPress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddTaskForm}
          options={{
            title:
              appLanguageProvider.translate('general.add') +
              ' ' +
              appLanguageProvider.translate('task.name.single'),
          }}>
          {props => (
            <AddTaskForm
              {...props}
              onSubmit={handleTaskAdd}
              labels={unusedLabels}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.SingleTask}
          options={{
            title:
              selectedTask?.title ??
              appLanguageProvider.translate('general.notFound'),
          }}>
          {props => (
            <SingleTask
              {...props}
              task={selectedTask}
              error={
                selectedTask
                  ? null
                  : appLanguageProvider.translate('general.notFound')
              }
              labels={labels}
              onAddSubtaskPress={handleAddSubtaskPress}
              onSubtasksOrderChange={handleSubtasksOrderChange}
              onSubtaskCompletePress={handleSubtaskComplete}
              onCompletePress={handleTaskComplete}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AssSubtaskForm}
          options={{
            title:
              appLanguageProvider.translate('general.add') +
              ' ' +
              appLanguageProvider.translate('subtask.name.single'),
          }}>
          {props => (
            <AddSubtaskForm
              {...props}
              error={
                selectedTask
                  ? null
                  : appLanguageProvider.translate('general.notFound')
              }
              taskId={selectedTask?.id ?? null}
              onSubmit={subtask =>
                handleAddSubtask(subtask, props.navigation.goBack)
              }
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
    title: appLanguageProvider.translate('task.name.multiple'),
    name: 'TasksModule',
  },
  tasksDataSource,
);
