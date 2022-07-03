import { Flex, ListItem, Stack, Text } from '@react-native-material/core';
import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { IHistory, IStats, IWithLanguageProviderProps } from '../../lib/types';
import formatDate from '../../lib/utils/formatDate';

export interface IProgressProps {
  error: string | null;
  stats: IStats;
  history: IHistory[];
}

const styles = StyleSheet.create({
  progressBar: {
    height: 20,
    borderWidth: 1,
  },
  progressBarInternal: {
    backgroundColor: '#FF7F50',
    flex: 1,
  },
  progressBarDivider: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderWidth: 1,
  },
});

const PROGRESS_BAR_DIVIDERS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const Progress: React.FC<IWithLanguageProviderProps<IProgressProps>> = ({
  error,
  stats,
  history,
  languageProvider,
}) => {
  const levelProgress =
    ((stats.points - stats.prevLevelSize) /
      (stats.nextLevelSize - stats.prevLevelSize)) *
    100;

  return (
    <Flex fill>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Stack spacing={4} m={4}>
            <ListItem
              title={languageProvider.translate('level.name')}
              secondaryText={stats.level.toString()}
            />
            <ListItem
              title={languageProvider.translate('level.xp')}
              secondaryText={stats.points.toString()}
            />
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarInternal,
                  { width: `${levelProgress}%` },
                ]}
              />
              {PROGRESS_BAR_DIVIDERS.map(divider => (
                <View
                  style={[styles.progressBarDivider, { left: `${divider}%` }]}
                />
              ))}
            </View>
          </Stack>
          <Flex fill>
            <FlatList
              data={history}
              renderItem={({ item }) => (
                <ListItem
                  title={item.message}
                  trailing={
                    <View>
                      <Text>{item.points}</Text>
                    </View>
                  }
                  secondaryText={formatDate(item.timestamp)}
                />
              )}
            />
          </Flex>
        </>
      ) : null}
    </Flex>
  );
};

export default memo(Progress);
