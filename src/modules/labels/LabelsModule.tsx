import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import LabelsList, { ILabelsListProps } from '../../components/LabelsList';
import { ILabelData, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import AddLabelForm, {
  IAddLabelFormProps,
} from '../../components/AddLabelForm';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';

const Stack = createNativeStackNavigator();

const labelsDataSource = appDataSource;
const labelsLanguageProvider = appLanguageProvider;

const AddLabelFormWithLanguageProvider =
  withLanguageProvider<IAddLabelFormProps>(
    AddLabelForm,
    labelsLanguageProvider,
  );

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    labelsLanguageProvider,
  );

const LabelsListWithLanguageProvider = withLanguageProvider<ILabelsListProps>(
  LabelsList,
  labelsLanguageProvider,
);

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
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: labelsLanguageProvider.translate('category.name.multiple'),
          }}>
          {props => (
            <LabelsListWithLanguageProvider
              {...props}
              error={error}
              items={labels}
              onAddPress={handleAddPress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddLabelForm}
          options={{
            title:
              labelsLanguageProvider.translate('general.add') +
              ' ' +
              labelsLanguageProvider.translate('category.name.single'),
          }}>
          {props => (
            <AddLabelFormWithLanguageProvider
              {...props}
              onSubmit={handleLabelAdd}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<LabelsModuleData, LabelsModuleActions>(
  LabelsModule,
  {
    title: labelsLanguageProvider.translate('category.name.multiple'),
    name: 'LabelsModule',
  },
  labelsDataSource,
);
