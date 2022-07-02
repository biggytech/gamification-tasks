// @ts-ignore Ignore not defined types for internal EventEmitter
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

interface ISubscription {
  remove: () => void;
}

class Events<TEventActions> {
  private emitter: typeof EventEmitter;
  actions: { [key in keyof TEventActions]: string };

  constructor(actions: { [key in keyof TEventActions]: string }) {
    this.emitter = new EventEmitter();
    this.actions = actions;
  }

  subscribe(
    eventName: keyof TEventActions,
    handler: (...args: any[]) => any,
  ): ISubscription {
    return this.emitter.addListener(eventName, handler);
  }

  emit(eventName: keyof TEventActions, ...args: any[]) {
    this.emitter.emit(eventName, ...args);
  }
}

export default Events;
