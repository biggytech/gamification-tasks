import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import LabelsList from '../../components/LabelsList';
import { ILabelData, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import AddLabelForm from '../../components/AddLabelForm';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';

const Stack = createNativeStackNavigator();

const labelsDataSource = appDataSource;

const screens = {
  LabelsList: 'LabelsList',
  AddLabelForm: 'AddLabelForm',
};

type LabelsModuleData = Pick<IAppData, 'labels' | 'error'>;
type LabelsModuleActions = keyof typeof labelsDataSource.actions;

const LabelsModule: ModuleComponent<LabelsModuleData, LabelsModuleActions> = ({
  data,
  callDispatch,
  actions,
  navigation,
}) => {
  const { labels, error } = data;

  useFocusEffect(
    useCallback(() => {
      callDispatch(actions.LOAD_LABELS);

      return () => {
        callDispatch(actions.CLEAR_LABELS);
      };
    }, [actions.CLEAR_LABELS, actions.LOAD_LABELS, callDispatch]),
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate(screens.AddLabelForm);
  }, [navigation]);

  const handleLabelAdd = useCallback(
    async (label: ILabelData) => {
      await callDispatch(actions.ADD_LABEL, label);
      navigation.navigate(screens.LabelsList);
    },
    [actions.ADD_LABEL, callDispatch, navigation],
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.LabelsList}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: 'Labels',
          }}>
          {props => (
            <LabelsList
              {...props}
              error={error}
              items={labels}
              onAddPress={handleAddPress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddLabelForm}
          options={{ title: 'Add a Label' }}>
          {props => <AddLabelForm {...props} onSubmit={handleLabelAdd} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<LabelsModuleData, LabelsModuleActions>(
  LabelsModule,
  {
    title: 'Labels',
    name: 'LabelsModule',
  },
  labelsDataSource,
);
