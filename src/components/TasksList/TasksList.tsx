import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ITask } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

interface TasksListProps {
  items: ITask[];
  onAddPress: () => void;
  error: null | string;
}

const TasksList: React.FC<TasksListProps> = ({ items, onAddPress, error }) => {
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {!error ? (
        <>
          <Button title="Add a task" onPress={onAddPress} />
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                leading={
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

export default memo(TasksList);
