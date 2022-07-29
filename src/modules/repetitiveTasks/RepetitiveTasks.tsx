import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { IRepetitiveTaskData, Key, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import RepetitiveTasksList, {
  IRepetitiveTasksListProps,
} from '../../components/RepetitiveTasksList';
import AddRepetitiveTaskForm, {
  IAddRepetitiveTaskFormProps,
} from '../../components/AddRepetitiveTaskForm';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';

const Stack = createNativeStackNavigator();

const repetitiveTasksDataSource = appDataSource;
const repetitiveTasksLanguageProvider = appLanguageProvider;

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    repetitiveTasksLanguageProvider,
  );

const AddRepetitiveTaskFormWithLanguageProvider =
  withLanguageProvider<IAddRepetitiveTaskFormProps>(
    AddRepetitiveTaskForm,
    repetitiveTasksLanguageProvider,
  );

const RepetitiveTasksListWithLanguageProvider =
  withLanguageProvider<IRepetitiveTasksListProps>(
    RepetitiveTasksList,
    repetitiveTasksLanguageProvider,
  );

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
      callDispatch(actions.LOAD_REPETITIVE_TASKS);
    },
    [
      actions.COMPLETE_REPETITIVE_TASK,
      actions.LOAD_REPETITIVE_TASKS,
      callDispatch,
    ],
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.RepetitiveTasksList}
          options={{
            headerLeft: () => (
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: repetitiveTasksLanguageProvider.translate(
              'repetitiveTask.name.multiple',
            ),
          }}>
          {props => (
            <RepetitiveTasksListWithLanguageProvider
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
          options={{
            title:
              repetitiveTasksLanguageProvider.translate('general.add') +
              ' ' +
              repetitiveTasksLanguageProvider.translate(
                'repetitiveTask.name.single',
              ),
          }}>
          {props => (
            <AddRepetitiveTaskFormWithLanguageProvider
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
  RepetitiveTasksModule,
  {
    title: repetitiveTasksLanguageProvider.translate(
      'repetitiveTask.name.multiple',
    ),
    name: 'RepetitiveTasksModule',
  },
  repetitiveTasksDataSource,
);
