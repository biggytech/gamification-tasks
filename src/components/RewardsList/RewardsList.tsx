import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IReward } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

interface RewardsListProps {
  items: IReward[];
  error: null | string;
  onAddPress: () => void;
}

const RewardsList: React.FC<RewardsListProps> = ({
  error,
  items,
  onAddPress,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button title="Add a reward" onPress={onAddPress} />
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                trailing={
                  <View>
                    <Text>{item.level}</Text>
                  </View>
                }
              />
            )}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(RewardsList);
