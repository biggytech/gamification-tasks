import { IFileSystemProvider } from '../../../lib/types';
import RNFetchBlob from 'rn-fetch-blob';
import LOCATIONS from './locations';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';

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

  async pickFile(type: string): Promise<string> {
    const file = await DocumentPicker.pickSingle({
      // Currently isn't working with json extension, see https://github.com/rnmods/react-native-document-picker/issues/575
      // type,
    });
    const contents = await RNFetchBlob.fs.readFile(
      file.uri.replace('file://', ''),
      'utf8',
    );
    return contents;
  }
}

export default FileSystemProvider;
