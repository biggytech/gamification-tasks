import ALLOWED_HISTORY_COUNT from '../../../config/historyCount';
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
  await appRepository.clearOldestHistoryItems(ALLOWED_HISTORY_COUNT);
}

export default writeToHistory;
