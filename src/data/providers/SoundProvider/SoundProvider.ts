import Sound from 'react-native-sound';

class SoundProvider<TSoundFiles> {
  soundFiles: { [key in keyof TSoundFiles]: string };

  constructor(soundFiles: { [key in keyof TSoundFiles]: string }) {
    this.soundFiles = soundFiles;
  }

  play(fileName: keyof TSoundFiles) {
    const whoosh = new Sound(fileName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      whoosh.play(success => {
        if (!success) {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });

    whoosh.setVolume(0.5);
    whoosh.release();
  }
}

export default SoundProvider;
