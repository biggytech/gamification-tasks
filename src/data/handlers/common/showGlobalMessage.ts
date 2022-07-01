import { IGlobalMessage } from '../../../lib/types';
import appEventsProvider from '../../appEventsProvider';

function showGlobalMessage(message: IGlobalMessage) {
  appEventsProvider.emit(appEventsProvider.actions.SHOW_TOAST, message);
}

export default showGlobalMessage;
