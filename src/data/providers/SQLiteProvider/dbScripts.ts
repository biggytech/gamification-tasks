type DbScripts = Array<{
  version: number;
  createScripts: string[];
}>;

const dbScripts: DbScripts = [
  {
    version: 1,
    createScripts: [
      'CREATE TABLE IF NOT EXISTS labels (name text NOT NULL, color text NOT NULL)',
    ],
  },
];

export default dbScripts;
