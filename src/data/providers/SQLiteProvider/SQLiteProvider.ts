import {
  ILabel,
  ILabelData,
  IRepetitiveTask,
  IRepetitiveTaskData,
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

SQLite.enablePromise(true);

class SQLiteProvider {
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
        reject(new Error('The database is not initialized'));
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

  async getSettings() {
    return (
      await this.executeQuery('SELECT * from settings WHERE id = ?', [
        defaults.settings.id,
      ])
    )[0];
  }

  async changeLevelSize(levelSize: LevelSize) {
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
    return await this.executeQuery('SELECT * from repetitiveTasks');
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
    return await this.executeQuery('SELECT * from tasks');
  }

  async addTask(task: ITaskData) {
    return (
      await this.executeQuery(
        'INSERT INTO tasks (title, value, labelId) VALUES (?, ?, ?) RETURNING *',
        [task.title, task.value, task.labelId],
      )
    )[0];
  }

  async getUnusedLabels(): Promise<ILabel[]> {
    const tasks = await this.getTasks();
    const usedLabelsIds = Array.from(new Set(tasks.map(task => task.labelId)));
    const query = `SELECT * from labels WHERE id NOT in (${usedLabelsIds
      .map(_ => '?')
      .join(',')})`;
    return await this.executeQuery(query, usedLabelsIds);
  }

  async getTaskWithAdditions(id: Key): Promise<ITaskWithAdditions | null> {
    const tasksRawData = await this.executeQuery(
      `SELECT tasks.id, tasks.title, tasks.value, tasks.labelId,
      subtasks.id as subtaskId,
      subtasks.title as subtaskTitle,
      subtasks.value as subtaskValue
      from tasks LEFT JOIN subtasks ON tasks.id = subtasks.taskId WHERE tasks.id = ?`,
      [id],
    );
    if (tasksRawData.length === 0) {
      return null;
    }

    const task: ITaskWithAdditions = {
      id,
      title: tasksRawData[0].title,
      value: tasksRawData[0].value,
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
        });
      }
    });

    return task;
  }

  async addSubtask(subtask: ISubtaskData): Promise<ISubtask> {
    return (
      await this.executeQuery(
        'INSERT INTO subtasks (title, value, taskId) VALUES (?, ?, ?) RETURNING *',
        [subtask.title, subtask.value, subtask.taskId],
      )
    )[0];
  }
}

export default new SQLiteProvider();
