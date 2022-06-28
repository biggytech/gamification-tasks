import React from 'react';
import { NavigationProp } from '@react-navigation/native';

export interface IModule<TData, TActions extends string | number | symbol> {
  title: string;
  name: string;
  Component: React.ComponentType<ModuleComponentProps<TData, TActions>>;
}

export type Key = number;

export type ModuleComponentProps<
  TData,
  TActions extends string | number | symbol,
> = React.PropsWithoutRef<{}> & {
  data: TData;
  callDispatch: (action: TActions, value?: any) => void;
  actions: { [action in TActions]: TActions };
  navigation: NavigationProp<any> & { openDrawer: () => void };
};

export type ModuleComponent<
  TData,
  TActions extends string | number | symbol,
> = React.ComponentType<ModuleComponentProps<TData, TActions>>;

export interface IDataSource<TData, TActions extends string | number | symbol> {
  getData: () => TData;
  callAction: (action: TActions, value?: any) => void;
  actions: { [action in TActions]: TActions };
}

export interface ILabelData {
  name: string;
  color: string;
}

export interface ILabel extends ILabelData {
  id: Key;
}

export type Point = number;

export type LevelSize = Point;

export interface IRepetitiveTaskData {
  title: string;
  value: Point;
}

export interface IRepetitiveTask extends IRepetitiveTaskData {
  id: Key;
}

export interface ITaskData {
  title: string;
  value: Point;
  labelId: Key;
}

export interface ITask extends ITaskData {
  id: Key;
}
