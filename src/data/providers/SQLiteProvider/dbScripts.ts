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
      `CREATE TABLE IF NOT EXISTS tasks (id integer PRIMARY KEY AUTOINCREMENT, title text NOT NULL, value integer NOT NULL, labelId integer NOT NULL, FOREIGN KEY(labelId) REFERENCES labels(id))`,
      `CREATE TABLE IF NOT EXISTS subtasks 
      (id integer PRIMARY KEY AUTOINCREMENT, title text NOT NULL, 
        value integer NOT NULL, taskId integer NOT NULL, position integer NOT NULL, 
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
    ],
  },
];

export default dbScripts;
