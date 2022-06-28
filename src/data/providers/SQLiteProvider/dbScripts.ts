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
      'CREATE TABLE IF NOT EXISTS settings (id integer PRIMARY KEY AUTOINCREMENT, levelSize integer NOT NULL)',
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
    ],
  },
];

export default dbScripts;
