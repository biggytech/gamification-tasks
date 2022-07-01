import { IHistoryData, Point } from '../../../lib/types';
import getTimestamp from '../../../lib/utils/getTimestamp';
import appRepository from '../../appRepository';

async function writeToHistory(message: string, points: Point) {
  const history: IHistoryData = {
    message,
    points,
    timestamp: getTimestamp(),
  };
  await appRepository.addHistory(history);
}

export default writeToHistory;
