import {
  IAchievement,
  IBackupData,
  IHistory,
  IHistoryData,
  ILabel,
  ILabelData,
  IRepetitiveTask,
  IRepetitiveTaskData,
  IRepetitiveTaskHistory,
  IRepetitiveTaskHistoryData,
  IRepetitiveTaskWithAdditions,
  IReward,
  IRewardData,
  ISettings,
  IStats,
  ISubtask,
  ISubtaskData,
  ITask,
  ITaskData,
  ITaskWithAdditions,
  Key,
  LevelSize,
} from '../lib/types';
import DatabaseProvider from './providers/DatabaseProvider';

const appDatabaseProvider = new DatabaseProvider();

const appRepository = {
  async prepare(): Promise<boolean> {
    try {
      await appDatabaseProvider.prepare();
      return true;
    } catch (err) {
      console.log('ERR', err);
      return false;
    }
  },
  getLabels: async () => await appDatabaseProvider.getLabels(),
  addLabel: async (label: ILabelData): Promise<ILabel> =>
    await appDatabaseProvider.addLabel(label),
  deleteDatabase: async () => await appDatabaseProvider.deleteDatabase(),
  getDbSize: async (): Promise<number> => await appDatabaseProvider.getDbSize(),
  getSettings: async (): Promise<ISettings> =>
    await appDatabaseProvider.getSettings(),
  changeLevelSize: async (levelSize: LevelSize) =>
    await appDatabaseProvider.changeLevelSize(levelSize),
  getRepetitiveTasks: async (): Promise<IRepetitiveTask[]> =>
    await appDatabaseProvider.getRepetitiveTasks(),
  addRepetitiveTask: async (task: IRepetitiveTaskData) =>
    await appDatabaseProvider.addRepetitiveTask(task),
  getTasks: async (): Promise<ITask[]> => await appDatabaseProvider.getTasks(),
  addTask: async (task: ITaskData) => await appDatabaseProvider.addTask(task),
  getUnusedLabels: async () => await appDatabaseProvider.getUnusedLabels(),
  getTaskWithAdditions: async (id: Key): Promise<ITaskWithAdditions | null> =>
    await appDatabaseProvider.getTaskWithAdditions(id),
  addSubtask: async (subtask: ISubtaskData) =>
    await appDatabaseProvider.addSubtask(subtask),
  getRewards: async (): Promise<IReward[]> =>
    await appDatabaseProvider.getRewards(),
  addReward: async (reward: IRewardData): Promise<IReward> =>
    await appDatabaseProvider.addReward(reward),
  getMaxRewardsLevel: async (): Promise<number | null> =>
    await appDatabaseProvider.getMaxRewardsLevel(),
  getStats: async (): Promise<IStats> => await appDatabaseProvider.getStats(),
  changeStats: async (stats: IStats): Promise<IStats> =>
    await appDatabaseProvider.changeStats(stats),
  getHistory: async (): Promise<IHistory[]> =>
    await appDatabaseProvider.getHistory(),
  addHistory: async (history: IHistoryData): Promise<IHistory> =>
    await appDatabaseProvider.addHistory(history),
  clearOldestHistoryItems: async (countToPreserve: number): Promise<void> =>
    await appDatabaseProvider.clearOldestHistoryItems(countToPreserve),
  getRepetitiveTask: async (id: Key): Promise<IRepetitiveTask | null> =>
    await appDatabaseProvider.getRepetitiveTask(id),
  getMaxSubtasksPosition: async (taskId: Key): Promise<number | null> =>
    await appDatabaseProvider.getMaxSubtasksPosition(taskId),
  changeSubtask: async (subtask: ISubtask): Promise<ISubtask> =>
    await appDatabaseProvider.changeSubtask(subtask),
  pickReward: async (id: Key): Promise<IReward> =>
    await appDatabaseProvider.pickReward(id),
  changeTask: async (task: ITask): Promise<ITask> =>
    await appDatabaseProvider.changeTask(task),
  getAchievements: async (): Promise<IAchievement[]> =>
    await appDatabaseProvider.getAchievements(),
  getNotCompletedAchievements: async (): Promise<IAchievement[]> =>
    await appDatabaseProvider.getNotCompletedAchievements(),
  changeAchievement: async (achievement: IAchievement): Promise<IAchievement> =>
    await appDatabaseProvider.changeAchievement(achievement),
  getNotCompletedTasks: async (): Promise<ITask[]> =>
    await appDatabaseProvider.getNotCompletedTasks(),
  getCompletedTasks: async (): Promise<ITask[]> =>
    await appDatabaseProvider.getCompletedTasks(),
  getBackupData: async (): Promise<IBackupData> =>
    await appDatabaseProvider.getBackupData(),
  restoreFromBackup: async (backup: IBackupData) =>
    await appDatabaseProvider.restoreFromBackup(backup),
  addRepetitiveTaskHistory: async (
    history: IRepetitiveTaskHistoryData,
  ): Promise<IRepetitiveTaskHistory> =>
    await appDatabaseProvider.addRepetitiveTaskHistory(history),
  getRepetitiveTasksHistory: async (): Promise<IRepetitiveTaskHistory[]> =>
    await appDatabaseProvider.getRepetitiveTasksHistory(),
  getRepetitiveTasksWithAdditions: async (
    fromTimestamp: number,
  ): Promise<IRepetitiveTaskWithAdditions[]> =>
    await appDatabaseProvider.getRepetitiveTasksWithAdditions(fromTimestamp),
};

export default appRepository;
