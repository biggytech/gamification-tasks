import { IModule } from '../lib/types';
import LabelsModule from '../modules/labels';
import DeveloperSettingsModule from '../modules/developerSettings';

const modules: IModule<any, any>[] = [LabelsModule, DeveloperSettingsModule];

export default modules;
