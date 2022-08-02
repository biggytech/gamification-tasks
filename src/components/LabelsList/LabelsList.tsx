import React, { memo } from 'react';
import { FlatList, Text } from 'react-native';
import { ILabel, IWithLanguageProviderProps } from '../../lib/types';
import { ListItem } from '@react-native-material/core';
import { Button } from '@react-native-material/core';
import LabelIcon from '../common/LabelIcon';

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
                leading={<LabelIcon color={item.color} />}
              />
            )}
          />
        </>
      ) : null}
    </>
  );
};

export default memo(LabelsList);
