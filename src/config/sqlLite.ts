interface ISQLiteConfig {
  filename: string;
  version: number;
  name: string;
  size: number;
}

const sqLiteConfig: ISQLiteConfig = {
  filename: 'test.db',
  version: 1,
  name: 'Test Database',
  size: 200000,
};

export default sqLiteConfig;
