import React, { memo } from 'react';
import { FlatList, Text } from 'react-native';
import { IAchievement } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import formatDate from '../../lib/utils/formatDate';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AchievementsListProps {
  items: IAchievement[];
  error: null | string;
}

const AchievementsList: React.FC<AchievementsListProps> = ({
  error,
  items,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => {
              return (
                <ListItem
                  title={item.title}
                  secondaryText={
                    item.completed && item.timestamp !== null
                      ? `${item.message}\nCompleted at: 
                      ${formatDate(item.timestamp)}`
                      : item.message
                  }
                  trailing={
                    item.completed ? <Icon name="check-outline" /> : null
                  }
                />
              );
            }}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(AchievementsList);
