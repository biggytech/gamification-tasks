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

export interface IRepetitiveTaskWithAdditions extends IRepetitiveTask {
  countCompletedToday: number;
}

export interface IRepetitiveTaskHistoryData {
  repetitiveTaskId: Key;
  timestamp: number;
}

export interface IRepetitiveTaskHistory extends IRepetitiveTaskHistoryData {
  id: Key;
}

export interface ITaskData {
  title: string;
  value: Point;
  labelId: Key;
  completed: boolean;
}

export interface ITask extends ITaskData {
  id: Key;
}

export interface ISubtaskData {
  title: string;
  value: Point;
  taskId: Key;
  position: number;
  completed: boolean;
}

export interface ISubtask extends ISubtaskData {
  id: Key;
}

export interface ITaskWithAdditions extends ITask {
  subtasks: ISubtask[];
}

export interface IRewardData {
  title: string;
  level: number;
  picked: boolean;
}

export interface IReward extends IRewardData {
  id: Key;
}

export interface IStats {
  level: number;
  points: Point;
  nextLevelSize: Point;
  prevLevelSize: Point;
}

export interface ISettings {
  levelSize: LevelSize;
}

export interface IHistoryData {
  message: string;
  points: number;
  timestamp: number;
}

export interface IHistory extends IHistoryData {
  id: Key;
}

export type IGlobalMessageType = 'success' | 'error';

export interface IGlobalMessage {
  type: IGlobalMessageType;
  title: string;
  message?: string;
  soundFile: string;
}

export interface IAchievementData {
  title: string;
  message: string;
  completed: boolean;
  timestamp: number | null;
}

export interface IAchievement extends IAchievementData {
  id: Key;
}

export interface ILanguageProvider {
  locale: string;
  translate: (path: string) => string;
}

export type IWithLanguageProviderProps<TComponentProps> = TComponentProps & {
  languageProvider: ILanguageProvider;
};

export interface IFileSystemProvider<TLocations> {
  saveFileToSharedDirectory: (
    location: keyof TLocations,
    filename: string,
    fileContents: string,
  ) => Promise<boolean>;
}

export interface IBackupData {
  labels: ILabel[];
  tasks: ITask[];
  subtasks: ISubtask[];
  repetitiveTasks: IRepetitiveTask[];
  repetitiveTasksHistory: IRepetitiveTaskHistory[];
  settings: ISettings;
  rewards: IReward[];
  stats: IStats;
  history: IHistory[];
  achievements: IAchievement[];
}