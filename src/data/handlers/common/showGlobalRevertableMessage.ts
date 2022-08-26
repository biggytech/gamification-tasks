import { IGlobalMessageRevertable } from '../../../lib/types';
import appEventsProvider from '../../appEventsProvider';

function showGlobalRevertableMessage(message: IGlobalMessageRevertable) {
  appEventsProvider.emit(
    appEventsProvider.actions
      .SHOW_REVERTABLE_TOAST as keyof typeof appEventsProvider.actions,
    message,
  );
}

export default showGlobalRevertableMessage;
