import {
  IAchievement,
  IBackupData,
  IHistory,
  IHistoryData,
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
  Key,
  LevelSize,
} from '../../../lib/types';
import SQLite from 'react-native-sqlite-storage';
import sqLiteConfig from '../../../config/sqlLite';
import dbScripts from './dbScripts';
import defaults from '../../../config/defaults';
import appLanguageProvider from '../../appLanguageProvider';

SQLite.enablePromise(true);

const SQLiteLanguageProvider = appLanguageProvider;

class DatabaseProvider {
  db: any = null;

  async executeQuery(sql: string, values?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        try {
          this.db.transaction(
            (tx: any) => {
              tx.executeSql(sql, values ?? [], (_tx: any, results: any) => {
                resolve(results.rows.raw());
              });
            },
            (err: Error) => {
              reject(err);
            },
          );
        } catch (err) {
          reject(err);
        }
      } else {
        reject(
          new Error(SQLiteLanguageProvider.translate('error.dbNotInitialized')),
        );
      }
    });
  }

  async prepare() {
    this.db = await SQLite.openDatabase({
      name: sqLiteConfig.filename,
    });
    this.executeQuery('PRAGMA foreign_keys = ON');
    await this.createTables();
    await this.fillTables();
  }

  async createTables() {
    for (const versionScripts of dbScripts) {
      if (versionScripts.version <= sqLiteConfig.version) {
        for (const createScript of versionScripts.createScripts) {
          await this.executeQuery(createScript);
        }
      }
    }
  }

  async fillTables() {
    for (const versionScripts of dbScripts) {
      if (versionScripts.version <= sqLiteConfig.version) {
        for (const upsertScript of versionScripts.upsertScripts) {
          await this.executeQuery(upsertScript.sql, upsertScript.values);
        }
      }
    }
  }

  async deleteDatabase() {
    await SQLite.deleteDatabase({
      name: sqLiteConfig.filename,
    });
    await this.prepare();
  }

  async getDbSize(): Promise<number> {
    const tables = await this.executeQuery(
      "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'",
    );

    let sizeInBytes = 0;

    for (const table of tables) {
      const tableName = table.name;
      const columns = await this.executeQuery(
        `PRAGMA table_info(${tableName})`,
      );

      const dataLength = (
        await this.executeQuery(
          `SELECT ${columns
            .map(column => `length(${column.name}) as ${column.name}`)
            .join(',')} FROM ${tableName}`,
        )
      ).reduce((sum, row) => {
        let rowSum = 0;

        for (const columnName in row) {
          if (typeof row[columnName] === 'number') {
            const columnType = columns.find(
              column => column.name === columnName,
            );

            // convert length size to bytes
            switch (columnType?.type) {
              case 'integer':
                rowSum += row[columnName] * 4;
                break;
              case 'text':
                rowSum += row[columnName] * 4;
                break;
              default:
                break;
            }
          }
        }

        return sum + rowSum;
      }, 0);

      sizeInBytes += dataLength;
    }
    return sizeInBytes;
  }

  async getLabels(): Promise<ILabel[]> {
    return await this.executeQuery('SELECT * from labels');
  }

  async addLabel(label: ILabelData) {
    return (
      await this.executeQuery(
        'INSERT INTO labels (name, color) VALUES (?, ?) RETURNING *',
        [label.name, label.color],
      )
    )[0];
  }

  async getSettings(): Promise<ISettings> {
    return (
      await this.executeQuery('SELECT * from settings WHERE id = ?', [
        defaults.settings.id,
      ])
    )[0];
  }

  async changeSettings(settings: ISettings): Promise<ISettings> {
    return (
      await this.executeQuery(
        `UPDATE settings
        SET levelSize = ?
        WHERE
            id = ? RETURNING *`,
        [settings.levelSize, defaults.settings.id],
      )
    )[0];
  }

  async changeLevelSize(levelSize: LevelSize): Promise<ISettings> {
    return (
      await this.executeQuery(
        `UPDATE settings
        SET levelSize = ?
        WHERE
            id = ? RETURNING *`,
        [levelSize, defaults.settings.id],
      )
    )[0];
  }

  async getRepetitiveTasks(): Promise<IRepetitiveTask[]> {
    return await this.executeQuery('SELECT * FROM repetitiveTasks');
  }

  async addRepetitiveTask(task: IRepetitiveTaskData) {
    return (
      await this.executeQuery(
        'INSERT INTO repetitiveTasks (title, value) VALUES (?, ?) RETURNING *',
        [task.title, task.value],
      )
    )[0];
  }

  async getTasks(): Promise<ITask[]> {
    const tasks = await this.executeQuery(
      'SELECT * from tasks ORDER BY completed ASC',
    );
    return tasks.map(task => ({ ...task, completed: Boolean(task.completed) }));
  }

  async getNotCompletedTasks(): Promise<ITask[]> {
    const tasks = await this.executeQuery(
      'SELECT * from tasks WHERE completed = 0',
    );
    return tasks.map(task => ({ ...task, completed: Boolean(task.completed) }));
  }

  async getCompletedTasks(): Promise<ITask[]> {
    const tasks = await this.executeQuery(
      'SELECT * from tasks WHERE completed = 1',
    );
    return tasks.map(task => ({ ...task, completed: Boolean(task.completed) }));
  }

  async addTask(task: ITaskData) {
    return (
      await this.executeQuery(
        'INSERT INTO tasks (title, value, labelId, completed) VALUES (?, ?, ?, ?) RETURNING *',
        [task.title, task.value, task.labelId, Number(task.completed)],
      )
    )[0];
  }

  async getUnusedLabels(): Promise<ILabel[]> {
    const tasks = await this.getNotCompletedTasks();
    const usedLabelsIds = Array.from(new Set(tasks.map(task => task.labelId)));
    const query = `SELECT * from labels WHERE id NOT in (${usedLabelsIds
      .map(_ => '?')
      .join(',')})`;
    return await this.executeQuery(query, usedLabelsIds);
  }

  async getTaskWithAdditions(id: Key): Promise<ITaskWithAdditions | null> {
    const tasksRawData = await this.executeQuery(
      `SELECT tasks.id, tasks.title, tasks.value, tasks.labelId, tasks.completed, 
      subtasks.id as subtaskId,
      subtasks.title as subtaskTitle,
      subtasks.value as subtaskValue,
      subtasks.position as subTaskPosition,
      subtasks.completed as subTaskCompleted
      from tasks LEFT JOIN subtasks ON tasks.id = subtasks.taskId WHERE tasks.id = ? 
      ORDER BY subtasks.position ASC`,
      [id],
    );
    if (tasksRawData.length === 0) {
      return null;
    }

    const task: ITaskWithAdditions = {
      id,
      title: tasksRawData[0].title,
      value: tasksRawData[0].value,
      completed: Boolean(tasksRawData[0].completed),
      labelId: tasksRawData[0].labelId,
      subtasks: [],
    };

    tasksRawData.forEach(taskRawData => {
      if (taskRawData.subtaskId) {
        task.subtasks.push({
          id: taskRawData.subtaskId,
          title: taskRawData.subtaskTitle,
          value: taskRawData.subtaskValue,
          taskId: id,
          position: taskRawData.subTaskPosition,
          completed: Boolean(taskRawData.subTaskCompleted),
        });
      }
    });

    return task;
  }

  async getSubtasks(): Promise<ISubtask[]> {
    const subtasks = await this.executeQuery('SELECT * FROM subtasks');
    return subtasks.map(subtask => ({
      ...subtask,
      completed: Boolean(subtask.completed),
    }));
  }

  async getMaxSubtasksPosition(taskId: Key): Promise<number | null> {
    return (
      (
        await this.executeQuery(
          'SELECT taskId, position FROM subtasks WHERE taskId = ? ORDER BY position DESC LIMIT 1',
          [taskId],
        )
      )[0]?.position ?? null
    );
  }

  async addSubtask(subtask: ISubtaskData): Promise<ISubtask> {
    return (
      await this.executeQuery(
        'INSERT INTO subtasks (title, value, taskId, position, completed) VALUES (?, ?, ?, ?, ?) RETURNING *',
        [
          subtask.title,
          subtask.value,
          subtask.taskId,
          subtask.position,
          Number(subtask.completed),
        ],
      )
    )[0];
  }

  async changeSubtask(subtask: ISubtask): Promise<ISubtask> {
    return (
      await this.executeQuery(
        `UPDATE subtasks 
        SET title = ?, value = ?, taskId = ?, position = ?, completed = ?  
        WHERE id = ? RETURNING *`,
        [
          subtask.title,
          subtask.value,
          subtask.taskId,
          subtask.position,
          Number(subtask.completed),
          subtask.id,
        ],
      )
    )[0];
  }

  async changeTask(task: ITask): Promise<ITask> {
    return (
      await this.executeQuery(
        `UPDATE tasks 
        SET title = ?, value = ?, labelId = ?, completed = ? 
        WHERE id = ? RETURNING *`,
        [task.title, task.value, task.labelId, Number(task.completed), task.id],
      )
    )[0];
  }

  async getRewards(): Promise<IReward[]> {
    const rewards = await this.executeQuery('SELECT * FROM rewards');
    return rewards.map(reward => ({
      ...reward,
      picked: Boolean(reward.picked),
    }));
  }

  async addReward(reward: IRewardData): Promise<IReward> {
    return (
      await this.executeQuery(
        'INSERT INTO rewards (title, level, picked) VALUES (?, ?, ?) RETURNING *',
        [reward.title, reward.level, Number(reward.picked)],
      )
    )[0];
  }

  async pickReward(id: Key): Promise<IReward> {
    return (
      await this.executeQuery(
        `UPDATE rewards 
        SET picked = ? 
        WHERE id = ? RETURNING *`,
        [1, id],
      )
    )[0];
  }

  async getMaxRewardsLevel(): Promise<number | null> {
    return (
      (
        await this.executeQuery(
          'SELECT level FROM rewards ORDER BY level DESC LIMIT 1',
        )
      )[0]?.level ?? null
    );
  }

  async getStats(): Promise<IStats> {
    return (
      await this.executeQuery('SELECT * from stats WHERE id = ?', [
        defaults.stats.id,
      ])
    )[0];
  }

  async changeStats(stats: IStats): Promise<IStats> {
    return (
      await this.executeQuery(
        `UPDATE stats 
        SET level = ?, points = ?, nextLevelSize = ?, prevLevelSize = ? 
        WHERE id = ? RETURNING *`,
        [
          stats.level,
          stats.points,
          stats.nextLevelSize,
          stats.prevLevelSize,
          defaults.stats.id,
        ],
      )
    )[0];
  }

  async getHistory(): Promise<IHistory[]> {
    return await this.executeQuery(
      'SELECT * FROM history ORDER BY timestamp DESC',
    );
  }

  async addHistory(history: IHistoryData): Promise<IHistory> {
    return (
      await this.executeQuery(
        'INSERT INTO history (message, points, timestamp) VALUES (?, ?, ?) RETURNING *',
        [history.message, history.points, history.timestamp],
      )
    )[0];
  }

  async clearOldestHistoryItems(countToPreserve: number): Promise<void> {
    const newestHistory: IHistory[] = await this.executeQuery(
      'SELECT id FROM history ORDER BY timestamp DESC LIMIT ?',
      [countToPreserve],
    );

    if (newestHistory.length > 0) {
      const newestHistoryIds = newestHistory.map(history => history.id);
      await this.executeQuery(
        `DELETE FROM history WHERE id NOT in (${newestHistoryIds
          .map(_ => '?')
          .join(',')})`,
      );
    }
  }

  async getRepetitiveTask(id: Key): Promise<IRepetitiveTask | null> {
    return (
      (
        await this.executeQuery('SELECT * from repetitiveTasks WHERE id = ?', [
          id,
        ])
      )[0] ?? null
    );
  }

  async getAchievements(): Promise<IAchievement[]> {
    const achievements = await this.executeQuery('SELECT * FROM achievements');
    return achievements.map(achievement => ({
      ...achievement,
      completed: Boolean(achievement.completed),
    }));
  }

  async changeAchievement(achievement: IAchievement): Promise<IAchievement> {
    return (
      await this.executeQuery(
        `UPDATE achievements 
        SET title = ?, message = ?, completed = ?, timestamp = ? 
        WHERE id = ? RETURNING *`,
        [
          achievement.title,
          achievement.message,
          Number(achievement.completed),
          achievement.timestamp,
          achievement.id,
        ],
      )
    )[0];
  }

  async getNotCompletedAchievements(): Promise<IAchievement[]> {
    const achievements = await this.executeQuery(
      'SELECT * FROM achievements WHERE completed = ?',
      [0],
    );
    return achievements.map(achievement => ({
      ...achievement,
      completed: Boolean(achievement.completed),
    }));
  }

  async getBackupData(): Promise<IBackupData> {
    const labels = await this.getLabels();
    const tasks = await this.getTasks();
    const subtasks = await this.getSubtasks();
    const repetitiveTasks = await this.getRepetitiveTasks();
    const settings = await this.getSettings();
    const rewards = await this.getRewards();
    const stats = await this.getStats();
    const history = await this.getHistory();
    const achievements = await this.getAchievements();

    return {
      labels,
      tasks,
      subtasks,
      repetitiveTasks,
      settings,
      rewards,
      stats,
      history,
      achievements,
    };
  }

  async restoreFromBackup(backup: IBackupData) {
    const {
      labels,
      tasks,
      subtasks,
      repetitiveTasks,
      settings,
      rewards,
      stats,
      history,
      achievements,
    } = backup;

    await this.executeQuery('DELETE FROM labels');
    await Promise.all(
      labels.map(
        async label =>
          await this.executeQuery(
            'INSERT INTO labels (id, name, color) VALUES (?, ?, ?)',
            [label.id, label.name, label.color],
          ),
      ),
    );

    await this.executeQuery('DELETE FROM tasks');
    await Promise.all(
      tasks.map(
        async task =>
          await this.executeQuery(
            'INSERT INTO tasks (id, title, value, labelId, completed) VALUES (?, ?, ?, ?, ?)',
            [
              task.id,
              task.title,
              task.value,
              task.labelId,
              Number(task.completed),
            ],
          ),
      ),
    );

    await this.executeQuery('DELETE FROM subtasks');
    await Promise.all(
      subtasks.map(
        async subtask =>
          await this.executeQuery(
            'INSERT INTO subtasks (id, title, value, taskId, position, completed) VALUES (?, ?, ?, ?, ?, ?)',
            [
              subtask.id,
              subtask.title,
              subtask.value,
              subtask.taskId,
              subtask.position,
              Number(subtask.completed),
            ],
          ),
      ),
    );

    await this.executeQuery('DELETE FROM repetitiveTasks');
    await Promise.all(
      repetitiveTasks.map(
        async task =>
          await this.executeQuery(
            'INSERT INTO repetitiveTasks (id, title, value) VALUES (?, ?, ?)',
            [task.id, task.title, task.value],
          ),
      ),
    );

    await this.changeSettings(settings);

    await this.executeQuery('DELETE FROM rewards');
    await Promise.all(
      rewards.map(
        async reward =>
          await this.executeQuery(
            'INSERT INTO rewards (id, title, level, picked) VALUES (?, ?, ?, ?)',
            [reward.id, reward.title, reward.level, Number(reward.picked)],
          ),
      ),
    );

    await this.changeStats(stats);

    await this.executeQuery('DELETE FROM history');
    await Promise.all(
      history.map(
        async _history =>
          await this.executeQuery(
            'INSERT INTO history (id, message, points, timestamp) VALUES (?, ?, ?, ?)',
            [
              _history.id,
              _history.message,
              _history.points,
              _history.timestamp,
            ],
          ),
      ),
    );

    await Promise.all(
      achievements.map(
        async achievement => await this.changeAchievement(achievement),
      ),
    );
  }
}

export default DatabaseProvider;
