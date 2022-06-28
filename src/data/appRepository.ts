import {
  ILabel,
  ILabelData,
  IRepetitiveTask,
  IRepetitiveTaskData,
  ITask,
  ITaskData,
  LevelSize,
} from '../lib/types';
import SQLiteProvider from './providers/SQLiteProvider';

const appRepository = {
  async prepare(): Promise<boolean> {
    try {
      await SQLiteProvider.prepare();
      return true;
    } catch (err) {
      console.log('ERR', err);
      return false;
    }
  },
  getLabels: async () => await SQLiteProvider.getLabels(),
  addLabel: async (label: ILabelData): Promise<ILabel> =>
    await SQLiteProvider.addLabel(label),
  deleteDatabase: async () => await SQLiteProvider.deleteDatabase(),
  getSettings: async () => await SQLiteProvider.getSettings(),
  changeLevelSize: async (levelSize: LevelSize) =>
    await SQLiteProvider.changeLevelSize(levelSize),
  getRepetitiveTasks: async (): Promise<IRepetitiveTask[]> =>
    await SQLiteProvider.getRepetitiveTasks(),
  addRepetitiveTask: async (task: IRepetitiveTaskData) =>
    await SQLiteProvider.addRepetitiveTask(task),
  getTasks: async (): Promise<ITask[]> => await SQLiteProvider.getTasks(),
  addTask: async (task: ITaskData) => await SQLiteProvider.addTask(task),
};

export default appRepository;
