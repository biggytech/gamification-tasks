import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { IRewardData, Key, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton, {
  IDrawerButtonProps,
} from '../../components/common/DrawerButton';
import RewardsList, { IRewardsListProps } from '../../components/RewardsList';
import AddRewardForm, {
  IAddRewardFormProps,
} from '../../components/AddRewardForm';
import appLanguageProvider from '../../data/appLanguageProvider';
import withLanguageProvider from '../../lib/hoc/withLanguageProvider';

const Stack = createNativeStackNavigator();

const rewardsDataSource = appDataSource;
const rewardsLanguageProvider = appLanguageProvider;

const AddRewardFormWithLanguageProvider =
  withLanguageProvider<IAddRewardFormProps>(
    AddRewardForm,
    rewardsLanguageProvider,
  );

const DrawerButtonWithLanguageProvider =
  withLanguageProvider<IDrawerButtonProps>(
    DrawerButton,
    rewardsLanguageProvider,
  );

const RewardsListWithLanguageProvider = withLanguageProvider<IRewardsListProps>(
  RewardsList,
  rewardsLanguageProvider,
);

const screens = {
  RewardsList: 'RewardsList',
  AddRewardForm: 'AddRewardForm',
};

type RewardsModuleData = Pick<
  IAppData,
  'rewards' | 'nextRewardLevel' | 'error' | 'stats'
>;
type RewardsModuleActions = keyof typeof rewardsDataSource.actions;

const RewardsModule: ModuleComponent<
  RewardsModuleData,
  RewardsModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { rewards, error, nextRewardLevel, stats } = data;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await callDispatch(actions.LOAD_REWARDS);
        await callDispatch(actions.LOAD_STATS);
        await callDispatch(actions.LOAD_NEXT_REWARD_LEVEL);
      })();

      return () => {
        callDispatch(actions.CLEAR_REWARDS);
      };
    }, [
      actions.CLEAR_REWARDS,
      actions.LOAD_NEXT_REWARD_LEVEL,
      actions.LOAD_REWARDS,
      actions.LOAD_STATS,
      callDispatch,
    ]),
  );

  const handleAddRewardPress = useCallback(() => {
    navigation.navigate(screens.AddRewardForm);
  }, [navigation]);

  const handleAddReward = useCallback(
    async (reward: IRewardData) => {
      await callDispatch(actions.ADD_REWARD, reward);
      navigation.navigate(screens.RewardsList);
      await callDispatch(actions.LOAD_NEXT_REWARD_LEVEL);
    },
    [
      actions.ADD_REWARD,
      actions.LOAD_NEXT_REWARD_LEVEL,
      callDispatch,
      navigation,
    ],
  );

  const handlePickReward = useCallback(
    (id: Key) => {
      callDispatch(actions.PICK_REWARD, id);
    },
    [actions.PICK_REWARD, callDispatch],
  );

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.RewardsList}
          options={{
            headerLeft: () => (
              <DrawerButtonWithLanguageProvider
                onPress={() => navigation.openDrawer()}
              />
            ),
            title: rewardsLanguageProvider.translate('reward.name.multiple'),
          }}>
          {props => (
            <RewardsListWithLanguageProvider
              {...props}
              items={rewards}
              error={error}
              onAddPress={handleAddRewardPress}
              maxLevelPickEnabled={stats.level}
              onRewardPickPress={handlePickReward}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddRewardForm}
          options={{
            title:
              rewardsLanguageProvider.translate('general.add') +
              ' ' +
              rewardsLanguageProvider.translate('reward.name.single'),
          }}>
          {props => (
            <AddRewardFormWithLanguageProvider
              {...props}
              onSubmit={handleAddReward}
              level={nextRewardLevel}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default asModule<RewardsModuleData, RewardsModuleActions>(
  RewardsModule,
  {
    title: rewardsLanguageProvider.translate('reward.name.multiple'),
    name: 'RewardsModule',
  },
  rewardsDataSource,
);
