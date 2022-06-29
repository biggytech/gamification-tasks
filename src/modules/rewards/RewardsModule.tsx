import React, { useCallback } from 'react';
import asModule from '../../lib/utils/asModule';
import { IRewardData, ModuleComponent } from '../../lib/types';
import appDataSource, { IAppData } from '../../data/appDataSource';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DrawerButton from '../../components/common/DrawerButton';
import RewardsList from '../../components/RewardsList';
import AddRewardForm from '../../components/AddRewardForm';

const Stack = createNativeStackNavigator();

const rewardsDataSource = appDataSource;

const screens = {
  RewardsList: 'RewardsList',
  AddRewardForm: 'AddRewardForm',
};

type RewardsModuleData = Pick<
  IAppData,
  'rewards' | 'nextRewardLevel' | 'error'
>;
type RewardsModuleActions = keyof typeof rewardsDataSource.actions;

const RewardsModule: ModuleComponent<
  RewardsModuleData,
  RewardsModuleActions
> = ({ data, callDispatch, actions, navigation }) => {
  const { rewards, error, nextRewardLevel } = data;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await callDispatch(actions.LOAD_REWARDS);
        await callDispatch(actions.LOAD_NEXT_REWARD_LEVEL);
      })();

      return () => {
        callDispatch(actions.CLEAR_REWARDS);
      };
    }, [
      actions.CLEAR_REWARDS,
      actions.LOAD_NEXT_REWARD_LEVEL,
      actions.LOAD_REWARDS,
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

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.RewardsList}
          options={{
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.openDrawer()} />
            ),
            title: 'Rewards',
          }}>
          {props => (
            <RewardsList
              {...props}
              items={rewards}
              error={error}
              onAddPress={handleAddRewardPress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={screens.AddRewardForm}
          options={{ title: 'Add a Reward' }}>
          {props => (
            <AddRewardForm
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
    title: 'Rewards',
    name: 'RewardsModule',
  },
  rewardsDataSource,
);
