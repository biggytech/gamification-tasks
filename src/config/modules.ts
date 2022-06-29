import { IModule } from '../lib/types';
import LabelsModule from '../modules/labels';
import DeveloperSettingsModule from '../modules/developerSettings';
import SettingsModule from '../modules/settings';
import RepetitiveTasksModule from '../modules/repetitiveTasks';
import TasksModule from '../modules/tasks';
import RewardsModule from '../modules/rewards';
import StatsModule from '../modules/stats';

const modules: IModule<any, any>[] = [
  StatsModule,
  TasksModule,
  RepetitiveTasksModule,
  LabelsModule,
  RewardsModule,
  SettingsModule,
  DeveloperSettingsModule,
];

export default modules;
