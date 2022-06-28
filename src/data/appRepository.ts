import { ILabelData, IRepetitiveTaskData, LevelSize } from '../lib/types';
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
  addLabel: async (label: ILabelData) => await SQLiteProvider.addLabel(label),
  deleteDatabase: async () => await SQLiteProvider.deleteDatabase(),
  getSettings: async () => await SQLiteProvider.getSettings(),
  changeLevelSize: async (levelSize: LevelSize) =>
    await SQLiteProvider.changeLevelSize(levelSize),
  getRepetitiveTasks: async () => await SQLiteProvider.getRepetitiveTasks(),
  addRepetitiveTask: async (task: IRepetitiveTaskData) =>
    await SQLiteProvider.addRepetitiveTask(task),
};

export default appRepository;
