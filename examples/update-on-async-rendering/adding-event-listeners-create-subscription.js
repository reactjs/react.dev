import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // Return the current value of the subscription (sourceProp).
    // highlight-next-line
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // Subscribe (e.g. add an event listener) to the subscription (sourceProp).
    // Call callback(newValue) whenever a subscription changes.
    // highlight-next-line
    sourceProp.subscribe(handleSubscriptionChange);

    // Return an unsubscribe method.
    // highlight-range{1-3}
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// Rather than passing the subscribable source to our ExampleComponent,
// We could just pass the subscribed value directly:
// highlight-range{1-3}
<Subscription source={dataSource}>
  {value => <ExampleComponent subscribedValue={value} />}
</Subscription>;
