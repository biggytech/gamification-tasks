import React, { useEffect } from 'react';
import Events from '../Events';

interface IEvent {
  name: string;
  handler: (...args: any[]) => any;
}

function asSubscriber<TProps, TEventActions>(
  Component: React.ComponentType<TProps>,
  events: IEvent[],
  eventsProvider: Events<TEventActions>,
) {
  const SubscriberComponent: React.FC<TProps> = props => {
    useEffect(() => {
      const subscriptions = events.map(({ name, handler }) =>
        eventsProvider.subscribe(name, handler),
      );

      return () => {
        subscriptions.forEach(subscription => subscription.remove());
      };
    }, []);

    return <Component {...props} />;
  };

  return SubscriberComponent;
}

export default asSubscriber;
