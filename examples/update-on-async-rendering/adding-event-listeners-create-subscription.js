import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(source) {
    // Return the current value of the subscription (source).
    // highlight-next-line
    return source.value;
  },

  subscribe(source, callback) {
    function handleSubscriptionChange() {
      callback(dataSource.value);
    }

    // Subscribe (e.g. add an event listener) to the subscription (source).
    // Call callback(newValue) whenever a subscription changes.
    // highlight-next-line
    source.subscribe(handleSubscriptionChange);

    // Return an unsubscribe method.
    // highlight-range{1-3}
    return function unsubscribe() {
      source.unsubscribe(handleSubscriptionChange);
    };
  },
});

// Rather than passing the subscribable source to our ExampleComponent,
// We could just pass the subscribed value directly:
// highlight-range{1-3}
<Subscription source={dataSource}>
  {value => <ExampleComponent subscribedValue={value} />}
</Subscription>;
