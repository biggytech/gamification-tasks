import { ListItem, Stack, Text } from '@react-native-material/core';
import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { IHistory, IStats } from '../../lib/types';
import formatDate from '../../lib/utils/formatDate';

interface IProgressProps {
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

const Progress: React.FC<IProgressProps> = ({ error, stats, history }) => {
  const levelProgress =
    ((stats.points - stats.prevLevelSize) /
      (stats.nextLevelSize - stats.prevLevelSize)) *
    100;

  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <Stack spacing={4} m={4}>
          <ListItem title="Level" secondaryText={stats.level.toString()} />
          <ListItem
            title="Experience points (XP)"
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
                leading={
                  <View>
                    <Text>{formatDate(item.timestamp)}</Text>
                  </View>
                }
              />
            )}
          />
        </Stack>
      ) : null}
    </>
  );
};

export default memo(Progress);
