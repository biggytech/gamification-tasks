import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IReward, IWithLanguageProviderProps, Key } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

export interface IRewardsListProps {
  items: IReward[];
  error: null | string;
  onAddPress: () => void;
  maxLevelPickEnabled: number;
  onRewardPickPress: (id: Key) => void;
}

const RewardsList: React.FC<IWithLanguageProviderProps<IRewardsListProps>> = ({
  error,
  items,
  onAddPress,
  maxLevelPickEnabled,
  onRewardPickPress,
  languageProvider,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button
            title={
              languageProvider.translate('general.add') +
              ' ' +
              languageProvider.translate('reward.name.single').toLowerCase()
            }
            onPress={onAddPress}
          />
          <FlatList
            data={items}
            renderItem={({ item }) => {
              let trailingNode = null;

              if (item.picked) {
                trailingNode = <Text>Picked</Text>;
              } else if (item.level <= maxLevelPickEnabled) {
                trailingNode = (
                  <Button
                    title={languageProvider.translate('reward.pick')}
                    onPress={() => onRewardPickPress(item.id)}
                  />
                );
              }

              return (
                <ListItem
                  title={item.title}
                  leading={
                    <View>
                      <Text>{item.level}</Text>
                    </View>
                  }
                  trailing={trailingNode}
                />
              );
            }}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(RewardsList);
