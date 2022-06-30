import defaults from '../config/defaults';
import DataSource from '../lib/data/DataSource';
import {
  IGlobalMessage,
  IHistory,
  IHistoryData,
  ILabel,
  IRepetitiveTask,
  IReward,
  ISettings,
  IStats,
  ISubtask,
  ITask,
  ITaskWithAdditions,
} from '../lib/types';
import ACTIONS from './actions';
import appRepository from './appRepository';
import appEventsProvider from './appEventsProvider';
import updateStats from './handlers/common/updateStats';

type AppActions = keyof typeof ACTIONS;

export interface IAppData {
  error: string | null;
  labels: ILabel[];
  dbSize: number;
  settings: ISettings;
  repetitiveTasks: IRepetitiveTask[];
  tasks: ITask[];
  unusedLabels: ILabel[];
  selectedTask: ITaskWithAdditions | null;
  rewards: IReward[];
  nextRewardLevel: number;
  stats: IStats;
  history: IHistory[];
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
  nextRewardLevel: defaults.nextRewardLevel,
  stats: {
    level: defaults.stats.level,
    points: defaults.stats.points,
    nextLevelSize: defaults.settings.levelSize,
    prevLevelSize: defaults.stats.points,
  },
  history: [],
};

const newLevelMessage: IGlobalMessage = {
  type: 'success',
  title: 'New level reached!',
  message: "It's time to pick your reward",
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
        const prevStats = await appRepository.getStats();
        const stats = await appRepository.changeStats({
          level: prevStats.level,
          points: prevStats.points,
          nextLevelSize: prevStats.points + value,
          prevLevelSize: prevStats.points,
        });

        return {
          ...data,
          settings,
          stats,
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
        const prevPosition = await appRepository.getMaxSubtasksPosition(
          value.taskId,
        );
        const subtask = await appRepository.addSubtask({
          ...value,
          position: prevPosition
            ? prevPosition + 1
            : defaults.subtasks.position,
        });

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
            : defaults.nextRewardLevel,
        };
      }
      case ACTIONS.LOAD_STATS: {
        const stats = await appRepository.getStats();

        return {
          ...data,
          stats,
        };
      }
      case ACTIONS.LOAD_HISTORY: {
        const history = await appRepository.getHistory();

        return {
          ...data,
          history,
        };
      }
      case ACTIONS.COMPLETE_REPETITIVE_TASK: {
        const task = await appRepository.getRepetitiveTask(value);
        if (task) {
          const shouldBumpLevel = await updateStats(task.value);

          const history: IHistoryData = {
            message: `Completed repetitive task "${task?.title}"`,
            points: task.value,
            timestamp: Date.now() / 1000,
          };
          await appRepository.addHistory(history);

          appEventsProvider.emit(
            appEventsProvider.actions.SHOW_TOAST,
            shouldBumpLevel
              ? newLevelMessage
              : {
                  type: 'success',
                  title: 'Completed!',
                },
          );
        }

        return data;
      }
      case ACTIONS.CHANGE_SUBTASKS_ORDER: {
        if (data.selectedTask && value.from !== value.to) {
          const changesSubtasks = data.selectedTask.subtasks.concat([]);
          // change items places
          const [movedItem] = changesSubtasks.splice(value.from, 1);
          changesSubtasks.splice(value.to, 0, movedItem);

          const subtasks = await Promise.all(
            changesSubtasks.map(async (subtask: ISubtask, i: number) => {
              if (subtask.position !== i + 1) {
                return await appRepository.changeSubtask({
                  ...subtask,
                  position: i + 1,
                });
              }

              return subtask;
            }),
          );

          return {
            ...data,
            selectedTask: data.selectedTask
              ? {
                  ...data.selectedTask,
                  subtasks,
                }
              : data.selectedTask,
          };
        } else {
          return data;
        }
      }
      case ACTIONS.PICK_REWARD: {
        const reward = await appRepository.pickReward(value);
        const index = data.rewards.findIndex(_reward => _reward.id === value);
        let newRewards = data.rewards;

        if (index !== -1) {
          newRewards = newRewards.concat([]);
          newRewards.splice(index, 1, reward);
        }

        return {
          ...data,
          rewards: newRewards,
        };
      }
      case ACTIONS.COMPLETE_SUBTASK: {
        if (data.selectedTask) {
          const index = data.selectedTask.subtasks.findIndex(
            _subtask => _subtask.id === value,
          );
          let newSubtasks = data.selectedTask.subtasks;

          if (index !== -1) {
            const subtask = await appRepository.changeSubtask({
              ...data.selectedTask.subtasks[index],
              completed: true,
            });
            newSubtasks = newSubtasks.concat([]);
            newSubtasks.splice(index, 1, subtask);

            const shouldBumpLevel = await updateStats(subtask.value);

            const history: IHistoryData = {
              message: `Completed subtask "${subtask.title}"`,
              points: subtask.value,
              timestamp: Date.now() / 1000,
            };
            await appRepository.addHistory(history);

            appEventsProvider.emit(
              appEventsProvider.actions.SHOW_TOAST,
              shouldBumpLevel
                ? newLevelMessage
                : {
                    type: 'success',
                    title: 'Completed!',
                  },
            );
          }

          return {
            ...data,
            selectedTask: {
              ...data.selectedTask,
              subtasks: newSubtasks,
            },
          };
        } else {
          return data;
        }
      }
      case ACTIONS.COMPLETE_TASK: {
        if (data.selectedTask) {
          await appRepository.changeTask({
            id: data.selectedTask.id,
            title: data.selectedTask.title,
            value: data.selectedTask.value,
            labelId: data.selectedTask.labelId,
            completed: true,
          });
          const task = await appRepository.getTaskWithAdditions(
            data.selectedTask.id,
          );

          if (task) {
            const shouldBumpLevel = await updateStats(task.value);

            const history: IHistoryData = {
              message: `Completed task "${task.title}"`,
              points: task.value,
              timestamp: Date.now() / 1000,
            };
            await appRepository.addHistory(history);

            appEventsProvider.emit(
              appEventsProvider.actions.SHOW_TOAST,
              shouldBumpLevel
                ? newLevelMessage
                : {
                    type: 'success',
                    title: 'Completed!',
                  },
            );

            return {
              ...data,
              selectedTask: task,
            };
          }
        }

        return data;
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
