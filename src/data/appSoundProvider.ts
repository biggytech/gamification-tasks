import SOUND_FILES from '../config/soundFiles';
import SoundProvider from './providers/SoundProvider/SoundProvider';

const appSoundProvider = new SoundProvider<typeof SOUND_FILES>(SOUND_FILES);

export default appSoundProvider;
