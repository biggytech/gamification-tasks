import React, { memo } from 'react';
import { FlatList, Text } from 'react-native';
import {
  IAchievement,
  IWithColorsProviderProps,
  IWithLanguageProviderProps,
} from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import formatDate from '../../lib/utils/formatDate';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IAchievementsListProps {
  items: IAchievement[];
  error: null | string;
}

const AchievementsList: React.FC<
  IWithColorsProviderProps<IWithLanguageProviderProps<IAchievementsListProps>>
> = ({ error, items, languageProvider, colorsProvider }) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
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
                    item.completed ? (
                      <Icon
                        name="check-circle"
                        color={colorsProvider.success}
                        size={20}
                      />
                    ) : null
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
