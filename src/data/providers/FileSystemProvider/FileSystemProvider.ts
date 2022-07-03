import { IFileSystemProvider } from '../../../lib/types';
import RNFetchBlob from 'rn-fetch-blob';
import LOCATIONS from './locations';
import Share from 'react-native-share';

class FileSystemProvider implements IFileSystemProvider<typeof LOCATIONS> {
  locations: typeof LOCATIONS = LOCATIONS;

  async saveFileToSharedDirectory(
    location: typeof LOCATIONS[keyof typeof LOCATIONS],
    filename: string,
    data: string,
  ): Promise<boolean> {
    try {
      const fileLocation = location + '/' + filename;

      const stream = await RNFetchBlob.fs.writeStream(
        fileLocation,
        'utf8',
        true,
      );

      await stream.write(data);

      await stream.close();

      const response = await Share.open({
        url: `file://${fileLocation}`,
      });

      await RNFetchBlob.fs.unlink(fileLocation);

      return response.success;
    } catch (err) {
      console.log('ERR', err);
      return false;
    }
  }
}

export default FileSystemProvider;
