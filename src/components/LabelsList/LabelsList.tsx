import React, { memo } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { ILabel, IWithLanguageProviderProps } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';

const styles = StyleSheet.create({
  color: {
    width: 20,
    height: 20,
    borderWidth: 1,
  },
});

export interface ILabelsListProps {
  items: ILabel[];
  onAddPress: () => void;
  error: null | string;
}

const LabelsList: React.FC<IWithLanguageProviderProps<ILabelsListProps>> = ({
  items,
  onAddPress,
  error,
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
              languageProvider.translate('category.name.single').toLowerCase()
            }
            onPress={onAddPress}
          />
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
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
