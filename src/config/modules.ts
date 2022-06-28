import { IModule } from '../lib/types';
import LabelsModule from '../modules/labels';
import DeveloperSettingsModule from '../modules/developerSettings';
import SettingsModule from '../modules/settings';
import RepetitiveTasksModule from '../modules/repetitiveTasks';
import TasksModule from '../modules/tasks';

const modules: IModule<any, any>[] = [
  TasksModule,
  RepetitiveTasksModule,
  LabelsModule,
  SettingsModule,
  DeveloperSettingsModule,
];

export default modules;
