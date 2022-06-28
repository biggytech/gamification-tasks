import { IModule } from '../lib/types';
import LabelsModule from '../modules/labels';
import DeveloperSettingsModule from '../modules/developerSettings';
import SettingsModule from '../modules/settings';
import RepetitiveTasksModule from '../modules/repetitiveTasks';

const modules: IModule<any, any>[] = [
  LabelsModule,
  RepetitiveTasksModule,
  DeveloperSettingsModule,
  SettingsModule,
];

export default modules;
