import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IRepetitiveTask } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

interface RepetitiveTasksListProps {
  items: IRepetitiveTask[];
  onAddPress: () => void;
  error: null | string;
}

const RepetitiveTasksList: React.FC<RepetitiveTasksListProps> = ({
  items,
  onAddPress,
  error,
}) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button title="Add a repetitive task" onPress={onAddPress} />
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                trailing={
                  <View>
                    <Text>{item.value}</Text>
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

export default memo(RepetitiveTasksList);
