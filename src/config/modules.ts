import { IModule } from '../lib/types';
import LabelsModule from '../modules/labels';
import DeveloperSettingsModule from '../modules/developerSettings';
import SettingsModule from '../modules/settings';

const modules: IModule<any, any>[] = [
  LabelsModule,
  DeveloperSettingsModule,
  SettingsModule,
];

export default modules;
