import React, { memo } from 'react';
import { FlatList, Text } from 'react-native';
import { IAchievement, IWithLanguageProviderProps } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import formatDate from '../../lib/utils/formatDate';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface AchievementsListProps {
  items: IAchievement[];
  error: null | string;
}

const AchievementsList: React.FC<
  IWithLanguageProviderProps<AchievementsListProps>
> = ({ error, items, languageProvider }) => {
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
                      ? `${item.message}\n${languageProvider.translate(
                          'general.completedAt',
                        )}: ${formatDate(item.timestamp, languageProvider)}`
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
