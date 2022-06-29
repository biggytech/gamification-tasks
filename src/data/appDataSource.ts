import defaults from '../config/defaults';
import DataSource from '../lib/data/DataSource';
import {
  ILabel,
  IRepetitiveTask,
  IReward,
  IStats,
  ITask,
  ITaskWithAdditions,
  LevelSize,
} from '../lib/types';
import ACTIONS from './actions';
import appRepository from './appRepository';

type AppActions = keyof typeof ACTIONS;

export interface IAppData {
  error: string | null;
  labels: ILabel[];
  dbSize: number;
  settings: {
    levelSize: LevelSize;
  };
  repetitiveTasks: IRepetitiveTask[];
  tasks: ITask[];
  unusedLabels: ILabel[];
  selectedTask: ITaskWithAdditions | null;
  rewards: IReward[];
  nextRewardLevel: number;
  stats: IStats;
}

const intialData: IAppData = {
  error: null,
  labels: [],
  dbSize: 0,
  settings: {
    levelSize: defaults.settings.levelSize,
  },
  repetitiveTasks: [],
  tasks: [],
  unusedLabels: [],
  selectedTask: null,
  rewards: [],
  nextRewardLevel: defaults.stats.level,
  stats: {
    level: defaults.stats.level,
    points: defaults.stats.points,
    nextLevelSize: defaults.settings.levelSize,
    prevLevelSize: defaults.stats.points,
  },
};

async function appActionHandler(
  data: IAppData,
  action: keyof typeof ACTIONS,
  value: any,
): Promise<IAppData> {
  try {
    switch (action) {
      case ACTIONS.LOAD_LABELS: {
        const labels = await appRepository.getLabels();
        return {
          ...data,
          labels,
        };
      }
      case ACTIONS.CLEAR_LABELS: {
        return {
          ...data,
          labels: intialData.labels,
        };
      }
      case ACTIONS.ADD_LABEL: {
        const label = await appRepository.addLabel(value);

        return {
          ...data,
          labels: data.labels.concat(label),
        };
      }
      case ACTIONS.DELETE_DATABASE: {
        await appRepository.deleteDatabase();

        return {
          ...data,
          dbSize: 0,
        };
      }
      case ACTIONS.LOAD_SETTINGS: {
        const settings = await appRepository.getSettings();

        return {
          ...data,
          settings,
        };
      }
      case ACTIONS.CHANGE_LEVEL_SIZE: {
        const settings = await appRepository.changeLevelSize(value);

        return {
          ...data,
          settings,
        };
      }
      case ACTIONS.LOAD_REPETITIVE_TASKS: {
        const repetitiveTasks = await appRepository.getRepetitiveTasks();
        return {
          ...data,
          repetitiveTasks,
        };
      }
      case ACTIONS.CLEAR_REPETITIVE_TASKS: {
        return {
          ...data,
          repetitiveTasks: intialData.repetitiveTasks,
        };
      }
      case ACTIONS.ADD_REPETITIVE_TASK: {
        const repetitiveTask = await appRepository.addRepetitiveTask(value);

        return {
          ...data,
          repetitiveTasks: data.repetitiveTasks.concat(repetitiveTask),
        };
      }
      case ACTIONS.LOAD_TASKS: {
        const tasks = await appRepository.getTasks();
        return {
          ...data,
          tasks,
        };
      }
      case ACTIONS.CLEAR_TASKS: {
        return {
          ...data,
          tasks: intialData.tasks,
        };
      }
      case ACTIONS.ADD_TASK: {
        const task = await appRepository.addTask(value);

        return {
          ...data,
          tasks: data.tasks.concat(task),
        };
      }
      case ACTIONS.LOAD_UNUSED_LABELS: {
        const unusedLabels = await appRepository.getUnusedLabels();
        return {
          ...data,
          unusedLabels,
        };
      }
      case ACTIONS.LOAD_SELECTED_TASK: {
        const selectedTask = await appRepository.getTaskWithAdditions(value);
        return {
          ...data,
          selectedTask,
        };
      }
      case ACTIONS.ADD_SUBTASK: {
        const subtask = await appRepository.addSubtask(value);

        return {
          ...data,
          selectedTask: data.selectedTask
            ? {
                ...data.selectedTask,
                subtasks: data.selectedTask.subtasks.concat(subtask),
              }
            : null,
        };
      }
      case ACTIONS.LOAD_REWARDS: {
        const rewards = await appRepository.getRewards();
        return {
          ...data,
          rewards,
        };
      }
      case ACTIONS.CLEAR_REWARDS: {
        return {
          ...data,
          rewards: intialData.rewards,
        };
      }
      case ACTIONS.ADD_REWARD: {
        const reward = await appRepository.addReward(value);

        return {
          ...data,
          rewards: data.rewards.concat(reward),
        };
      }
      case ACTIONS.LOAD_NEXT_REWARD_LEVEL: {
        const maxRewardsLevel = await appRepository.getMaxRewardsLevel();
        return {
          ...data,
          nextRewardLevel: maxRewardsLevel
            ? maxRewardsLevel + 1
            : defaults.stats.level,
        };
      }
      case ACTIONS.LOAD_STATS: {
        const stats = await appRepository.getStats();

        return {
          ...data,
          stats,
        };
      }
      default:
        return data;
    }
  } catch (err: any) {
    return {
      ...data,
      error: err?.message ?? null,
    };
  }
}

const appDataSource = new DataSource<IAppData, AppActions>(
  intialData,
  appActionHandler,
  ACTIONS as { [action in AppActions]: AppActions },
);

export default appDataSource;
