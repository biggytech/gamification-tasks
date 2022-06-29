import {
  ILabel,
  ILabelData,
  IRepetitiveTask,
  IRepetitiveTaskData,
  IReward,
  IRewardData,
  IStats,
  ISubtaskData,
  ITask,
  ITaskData,
  ITaskWithAdditions,
  Key,
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
  getUnusedLabels: async () => await SQLiteProvider.getUnusedLabels(),
  getTaskWithAdditions: async (id: Key): Promise<ITaskWithAdditions | null> =>
    await SQLiteProvider.getTaskWithAdditions(id),
  addSubtask: async (subtask: ISubtaskData) =>
    await SQLiteProvider.addSubtask(subtask),
  getRewards: async (): Promise<IReward[]> => await SQLiteProvider.getRewards(),
  addReward: async (reward: IRewardData): Promise<IReward> =>
    await SQLiteProvider.addReward(reward),
  getMaxRewardsLevel: async (): Promise<number | null> =>
    await SQLiteProvider.getMaxRewardsLevel(),
  getStats: async (): Promise<IStats> => await SQLiteProvider.getStats(),
  changeStats: async (stats: IStats): Promise<IStats> =>
    await SQLiteProvider.changeStats(stats),
};

export default appRepository;
