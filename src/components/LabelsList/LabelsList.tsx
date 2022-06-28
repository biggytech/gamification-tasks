import React, { memo } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { ILabel } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

const styles = StyleSheet.create({
  color: {
    width: 20,
    height: 20,
    borderWidth: 1,
  },
});

interface LabelsListProps {
  items: ILabel[];
  onAddPress: () => void;
  error: null | string;
}

const LabelsList: React.FC<LabelsListProps> = ({
  items,
  onAddPress,
  error,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button title="Add label" onPress={onAddPress} />
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ListItem
                title={item.name}
                leading={
                  <View
                    style={[styles.color, { backgroundColor: item.color }]}
                  />
                }
              />
            )}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(LabelsList);