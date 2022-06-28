import DataSource from '../lib/data/DataSource';
import { ILabel } from '../lib/types';
import ACTIONS from './actions';
import appRepository from './appRepository';

type AppActions = keyof typeof ACTIONS;

export interface IAppData {
  error: string | null;
  labels: ILabel[];
  dbSize: number;
}

const intialData: IAppData = {
  error: null,
  labels: [],
  dbSize: 0,
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
  ACTIONS,
);

export default appDataSource;