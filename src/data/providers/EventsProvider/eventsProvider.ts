import Events from '../../../lib/Events';
import EVENTS from './events';

const eventsProvider = new Events<typeof EVENTS>(EVENTS);

export default eventsProvider;
