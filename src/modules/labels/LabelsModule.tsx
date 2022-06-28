import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import LabelsList from '../../components/LabelsList';
import { ILabelData, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import AddLabelForm from '../../components/AddLabelForm';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-native-material/core';
import { useFocusEffect } from '@react-navigation/native';

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
      navigation.goBack();
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
              <Button
                title="Menu"
                variant="text"
                onPress={() => navigation.openDrawer()}
              />
            ),
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
        <Stack.Screen name={screens.AddLabelForm}>
          {props => <AddLabelForm {...props} onSubmit={handleLabelAdd} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<LabelsModuleData, LabelsModuleActions>(
  LabelsModule,
  {
    name: 'Labels',
  },
  labelsDataSource,
);
