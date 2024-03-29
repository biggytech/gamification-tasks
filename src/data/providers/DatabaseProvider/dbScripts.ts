import achievements from '../../../config/achievements';
import defaults from '../../../config/defaults';

type DbScripts = Array<{
  version: number;
  createScripts: string[];
  upsertScripts: Array<{
    sql: string;
    values: any[];
  }>;
}>;

const dbScripts: DbScripts = [
  {
    version: 1,
    createScripts: [
      'CREATE TABLE IF NOT EXISTS labels (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, color text NOT NULL)',
      `CREATE TABLE IF NOT EXISTS tasks (id integer PRIMARY KEY AUTOINCREMENT, 
        title text NOT NULL, value integer NOT NULL, labelId integer NOT NULL, 
        completed integer NOT NULL, 
        FOREIGN KEY(labelId) REFERENCES labels(id))`,
      `CREATE TABLE IF NOT EXISTS subtasks 
      (id integer PRIMARY KEY AUTOINCREMENT, title text NOT NULL, 
        value integer NOT NULL, taskId integer NOT NULL, position integer NOT NULL, 
        completed integer NOT NULL, 
        FOREIGN KEY(taskId) REFERENCES tasks(id))`,
      'CREATE TABLE IF NOT EXISTS repetitiveTasks (id integer PRIMARY KEY AUTOINCREMENT, title text NOT NULL, value integer NOT NULL)',
      'CREATE TABLE IF NOT EXISTS settings (id integer PRIMARY KEY AUTOINCREMENT, levelSize integer NOT NULL)',
      `CREATE TABLE IF NOT EXISTS rewards 
      (id integer PRIMARY KEY AUTOINCREMENT, title text NOT NULL, 
        level integer NOT NULL, picked integer NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS stats 
      (id integer PRIMARY KEY AUTOINCREMENT, level integer NOT NULL, points integer NOT NULL, 
        nextLevelSize integer NOT NULL, prevLevelSize integer NOT NULL)`,
      'CREATE TABLE IF NOT EXISTS history (id integer PRIMARY KEY AUTOINCREMENT, message text NOT NULL, points integer NOT NULL, timestamp integer NOT NULL)',
      `CREATE TABLE IF NOT EXISTS achievements (id integer PRIMARY KEY, 
        title text NOT NULL, message text NOT NULL, completed integer NOT NULL, timestamp integer)`,
      `CREATE TABLE IF NOT EXISTS repetitiveTasksHistory 
      (id integer PRIMARY KEY AUTOINCREMENT, repetitiveTaskId integer NOT NULL, 
      timestamp integer NOT NULL, FOREIGN KEY(repetitiveTaskId) REFERENCES repetitiveTasks(id))
      `,
    ],
    upsertScripts: [
      {
        sql: `INSERT INTO settings(id, levelSize) 
        SELECT ?, ? 
        WHERE NOT EXISTS(SELECT id FROM settings WHERE id = ?);`,
        values: [
          defaults.settings.id,
          defaults.settings.levelSize,
          defaults.settings.id,
        ],
      },
      {
        sql: `INSERT INTO stats(id, level, points, nextLevelSize, prevLevelSize) 
        SELECT ?, ?, ?, ?, ?
        WHERE NOT EXISTS(SELECT id FROM stats WHERE id = ?);`,
        values: [
          defaults.stats.id,
          defaults.stats.level,
          defaults.stats.points,
          defaults.settings.levelSize,
          defaults.stats.points,
          defaults.stats.id,
        ],
      },
      ...Object.values(achievements).map(achievement => ({
        sql: `INSERT INTO achievements(id, title, message, completed, timestamp) 
        SELECT ?, ?, ?, ?, ?
        WHERE NOT EXISTS(SELECT id FROM achievements WHERE id = ?);`,
        values: [
          achievement.id,
          achievement.title,
          achievement.message,
          defaults.achievements.completed,
          defaults.achievements.timestamp,
          achievement.id,
        ],
      })),
    ],
  },
];

export default dbScripts;
