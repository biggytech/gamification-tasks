import defaults from '../config/defaults';
import DataSource from '../lib/data/DataSource';
import {
  IAchievement,
  IGlobalMessage,
  IHistory,
  ILabel,
  ILabelData,
  IRepetitiveTask,
  IRepetitiveTaskData,
  IReward,
  IRewardData,
  ISettings,
  IStats,
  ISubtask,
  ISubtaskData,
  ITask,
  ITaskData,
  ITaskWithAdditions,
} from '../lib/types';
import ACTIONS from './actions';
import appRepository from './appRepository';
import updateStats from './handlers/common/updateStats';
import updateAchievements from './handlers/common/updateAchievements';
import showGlobalMessage from './handlers/common/showGlobalMessage';
import writeToHistory from './handlers/common/writeToHistory';
import appLanguageProvider from './appLanguageProvider';
import appSoundProvider from './appSoundProvider';
import loadBackupFile from './handlers/data/loadBackupFile';

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
  achievements: IAchievement[];
}

const initialData: IAppData = {
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
  achievements: [],
};

const getNewLevelMessage = (level: number): IGlobalMessage => ({
  type: 'success',
  title: `${appLanguageProvider.translate(
    'level.name',
  )} ${level} ${appLanguageProvider.translate('level.reached').toLowerCase()}!`,
  message: appLanguageProvider.translate('reward.timeToPick'),
  soundFile: appSoundProvider.soundFiles.notification_2,
});

async function appActionHandler(
  data: IAppData,
  action: keyof typeof ACTIONS,
  value: any,
): Promise<IAppData> {
  try {
    let dataToReturn = data;
    let isUpdateAchievements = false;

    switch (action) {
      case ACTIONS.LOAD_LABELS: {
        const labels = await appRepository.getLabels();
        dataToReturn = {
          ...data,
          labels,
        };
        break;
      }
      case ACTIONS.CLEAR_LABELS: {
        dataToReturn = {
          ...data,
          labels: initialData.labels,
        };
        break;
      }
      case ACTIONS.ADD_LABEL: {
        const labelToAdd: ILabelData = {
          ...value,
          name: value.name.trim(),
        };
        const label = await appRepository.addLabel(labelToAdd);

        dataToReturn = {
          ...data,
          labels: data.labels.concat(label),
        };
        break;
      }
      case ACTIONS.DELETE_DATABASE: {
        await appRepository.deleteDatabase();

        dataToReturn = {
          ...data,
          dbSize: 0,
        };
        break;
      }
      case ACTIONS.LOAD_SETTINGS: {
        const settings = await appRepository.getSettings();

        dataToReturn = {
          ...data,
          settings,
        };
        break;
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

        dataToReturn = {
          ...data,
          settings,
          stats,
        };
        break;
      }
      case ACTIONS.LOAD_REPETITIVE_TASKS: {
        const repetitiveTasks = await appRepository.getRepetitiveTasks();
        dataToReturn = {
          ...data,
          repetitiveTasks,
        };
        break;
      }
      case ACTIONS.CLEAR_REPETITIVE_TASKS: {
        dataToReturn = {
          ...data,
          repetitiveTasks: initialData.repetitiveTasks,
        };
        break;
      }
      case ACTIONS.ADD_REPETITIVE_TASK: {
        const repetitiveTaskToAdd: IRepetitiveTaskData = {
          ...value,
          title: value.title.trim(),
        };
        const repetitiveTask = await appRepository.addRepetitiveTask(
          repetitiveTaskToAdd,
        );

        dataToReturn = {
          ...data,
          repetitiveTasks: data.repetitiveTasks.concat(repetitiveTask),
        };
        break;
      }
      case ACTIONS.LOAD_TASKS: {
        const tasks = await appRepository.getTasks();
        dataToReturn = {
          ...data,
          tasks,
        };
        break;
      }
      case ACTIONS.CLEAR_TASKS: {
        dataToReturn = {
          ...data,
          tasks: initialData.tasks,
        };
        break;
      }
      case ACTIONS.ADD_TASK: {
        const taskToAdd: ITaskData = {
          ...value,
          title: value.title.trim(),
        };
        const task = await appRepository.addTask(taskToAdd);

        dataToReturn = {
          ...data,
          tasks: data.tasks.concat(task),
        };
        break;
      }
      case ACTIONS.LOAD_UNUSED_LABELS: {
        const unusedLabels = await appRepository.getUnusedLabels();
        dataToReturn = {
          ...data,
          unusedLabels,
        };
        break;
      }
      case ACTIONS.LOAD_SELECTED_TASK: {
        const selectedTask = await appRepository.getTaskWithAdditions(value);
        dataToReturn = {
          ...data,
          selectedTask,
        };
        break;
      }
      case ACTIONS.ADD_SUBTASK: {
        const prevPosition = await appRepository.getMaxSubtasksPosition(
          value.taskId,
        );
        const subtask: ISubtaskData = await appRepository.addSubtask({
          ...value,
          title: value.title.trim(),
          position: prevPosition
            ? prevPosition + 1
            : defaults.subtasks.position,
        });

        dataToReturn = {
          ...data,
          selectedTask: data.selectedTask
            ? {
                ...data.selectedTask,
                subtasks: data.selectedTask.subtasks.concat(subtask),
              }
            : null,
        };
        break;
      }
      case ACTIONS.LOAD_REWARDS: {
        const rewards = await appRepository.getRewards();
        dataToReturn = {
          ...data,
          rewards,
        };
        break;
      }
      case ACTIONS.CLEAR_REWARDS: {
        dataToReturn = {
          ...data,
          rewards: initialData.rewards,
        };
        break;
      }
      case ACTIONS.ADD_REWARD: {
        const rewardToAdd: IRewardData = {
          ...value,
          title: value.title.trim(),
        };
        const reward = await appRepository.addReward(rewardToAdd);

        dataToReturn = {
          ...data,
          rewards: data.rewards.concat(reward),
        };
        break;
      }
      case ACTIONS.LOAD_NEXT_REWARD_LEVEL: {
        const maxRewardsLevel = await appRepository.getMaxRewardsLevel();
        dataToReturn = {
          ...data,
          nextRewardLevel: maxRewardsLevel
            ? maxRewardsLevel + 1
            : initialData.nextRewardLevel,
        };
        break;
      }
      case ACTIONS.LOAD_STATS: {
        const stats = await appRepository.getStats();

        dataToReturn = {
          ...data,
          stats,
        };
        break;
      }
      case ACTIONS.LOAD_HISTORY: {
        const history = await appRepository.getHistory();

        dataToReturn = {
          ...data,
          history,
        };
        break;
      }
      case ACTIONS.COMPLETE_REPETITIVE_TASK: {
        const task = await appRepository.getRepetitiveTask(value);
        if (task) {
          const { shouldBumpLevel, level } = await updateStats(task.value);

          await writeToHistory(
            `${appLanguageProvider.translate(
              'general.completed',
            )} ${appLanguageProvider
              .translate('repetitiveTask.name.single')
              .toLowerCase()} "${task?.title}"`,
            task.value,
          );

          if (shouldBumpLevel) {
            await writeToHistory(
              `${appLanguageProvider.translate(
                'level.reached',
              )} ${appLanguageProvider
                .translate('level.name')
                .toLowerCase()} ${level}`,
              0,
            );
          }

          showGlobalMessage(
            shouldBumpLevel
              ? getNewLevelMessage(level)
              : {
                  type: 'success',
                  title:
                    appLanguageProvider.translate('general.completed') + '!',
                  soundFile: appSoundProvider.soundFiles.notification_1,
                },
          );

          isUpdateAchievements = true;
        }

        dataToReturn = data;
        break;
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

          dataToReturn = {
            ...data,
            selectedTask: data.selectedTask
              ? {
                  ...data.selectedTask,
                  subtasks,
                }
              : data.selectedTask,
          };
        } else {
          dataToReturn = data;
        }
        break;
      }
      case ACTIONS.PICK_REWARD: {
        const reward = await appRepository.pickReward(value);
        const index = data.rewards.findIndex(_reward => _reward.id === value);
        let newRewards = data.rewards;

        if (index !== -1) {
          newRewards = newRewards.concat([]);
          newRewards.splice(index, 1, reward);
        }

        dataToReturn = {
          ...data,
          rewards: newRewards,
        };
        break;
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

            const { shouldBumpLevel, level } = await updateStats(subtask.value);

            await writeToHistory(
              `${appLanguageProvider.translate(
                'general.completed',
              )} ${appLanguageProvider
                .translate('subtask.name.single')
                .toLowerCase()} "${subtask.title}"`,
              subtask.value,
            );

            if (shouldBumpLevel) {
              await writeToHistory(
                `${appLanguageProvider.translate(
                  'level.reached',
                )} ${appLanguageProvider
                  .translate('level.name')
                  .toLowerCase()} ${level}`,
                0,
              );
            }

            showGlobalMessage(
              shouldBumpLevel
                ? getNewLevelMessage(level)
                : {
                    type: 'success',
                    title:
                      appLanguageProvider.translate('general.completed') + '!',
                    soundFile: appSoundProvider.soundFiles.notification_1,
                  },
            );

            isUpdateAchievements = true;
          }

          dataToReturn = {
            ...data,
            selectedTask: {
              ...data.selectedTask,
              subtasks: newSubtasks,
            },
          };
        } else {
          dataToReturn = data;
        }
        break;
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
            const { shouldBumpLevel, level } = await updateStats(task.value);

            await writeToHistory(
              `${appLanguageProvider.translate(
                'general.completed',
              )} ${appLanguageProvider
                .translate('task.name.single')
                .toLowerCase()} "${task.title}"`,
              task.value,
            );

            if (shouldBumpLevel) {
              await writeToHistory(
                `${appLanguageProvider.translate(
                  'level.reached',
                )} ${appLanguageProvider
                  .translate('level.name')
                  .toLowerCase()} ${level}`,
                0,
              );
            }

            showGlobalMessage(
              shouldBumpLevel
                ? getNewLevelMessage(level)
                : {
                    type: 'success',
                    title:
                      appLanguageProvider.translate('general.completed') + '!',
                    soundFile: appSoundProvider.soundFiles.notification_1,
                  },
            );

            isUpdateAchievements = true;

            dataToReturn = {
              ...data,
              selectedTask: task,
            };
          }
        }

        break;
      }
      case ACTIONS.LOAD_ACHIEVEMENTS: {
        const achievements = await appRepository.getAchievements();

        dataToReturn = {
          ...data,
          achievements,
        };
        break;
      }
      case ACTIONS.CLEAR_ACHIEVEMENTS: {
        dataToReturn = {
          ...data,
          achievements: initialData.achievements,
        };
        break;
      }
      case ACTIONS.DOWNLOAD_BACKUP_FILE: {
        dataToReturn = data;
        await loadBackupFile();
        break;
      }
      case ACTIONS.GET_DB_SIZE: {
        const dbSize = await appRepository.getDbSize();
        dataToReturn = {
          ...data,
          dbSize,
        };
        break;
      }
      case ACTIONS.RESTORE_FROM_BACKUP: {
        await appRepository.restoreFromBackup(value);
        showGlobalMessage({
          type: 'success',
          title:
            appLanguageProvider.translate('settings.restoredSuccess') + '!',
          soundFile: appSoundProvider.soundFiles.notification_1,
        });
        break;
      }
      case ACTIONS.SHOW_GLOBAL_MESSAGE: {
        showGlobalMessage(value);
        break;
      }
      default: {
        dataToReturn = data;
      }
    }

    if (isUpdateAchievements) {
      await updateAchievements();
    }

    return dataToReturn;
  } catch (err: any) {
    console.log('ERR', err);
    return {
      ...data,
      error: err?.message ?? null,
    };
  }
}

const appDataSource = new DataSource<IAppData, AppActions>(
  initialData,
  appActionHandler,
  ACTIONS as { [action in AppActions]: AppActions },
);

export default appDataSource;
