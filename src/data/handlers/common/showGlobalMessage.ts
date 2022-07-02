import { IGlobalMessage } from '../../../lib/types';
import appEventsProvider from '../../appEventsProvider';

function showGlobalMessage(message: IGlobalMessage) {
  appEventsProvider.emit(
    appEventsProvider.actions
      .SHOW_TOAST as keyof typeof appEventsProvider.actions,
    message,
  );
}

export default showGlobalMessage;
