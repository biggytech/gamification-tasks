import { IDataSource } from '../types';

class DataSource<TData, TActions extends string | number | symbol>
  implements IDataSource<TData, TActions>
{
  private data: TData;
  private actionHandler: (
    data: TData,
    action: TActions,
    value: any,
  ) => Promise<TData>;
  actions: { [action in TActions]: TActions };

  constructor(
    initialData: TData,
    actionHandler: (
      data: TData,
      action: TActions,
      value: any,
    ) => Promise<TData>,
    actions: { [action in TActions]: TActions },
  ) {
    this.data = initialData;
    this.actionHandler = actionHandler;
    this.actions = actions;
  }

  getData(): TData {
    return this.data;
  }

  async callAction(action: keyof typeof this.actions, value: any) {
    this.data = await this.actionHandler(this.data, action, value);
  }
}

export default DataSource;
