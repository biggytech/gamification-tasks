import defaults from '../config/defaults';
import DataSource from '../lib/data/DataSource';
import { ILabel, IRepetitiveTask, ITask, LevelSize } from '../lib/types';
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
