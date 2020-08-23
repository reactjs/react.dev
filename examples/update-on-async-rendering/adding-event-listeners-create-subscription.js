import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // Return the current value of the subscription (sourceProp).
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // Subscribe (e.g. add an event listener) to the subscription (sourceProp).
    // Call callback(newValue) whenever a subscription changes.
    sourceProp.subscribe(handleSubscriptionChange);

    // Return an unsubscribe method.
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// Rather than passing the subscribable source to our ExampleComponent,
// We could just pass the subscribed value directly:
<Subscription source={dataSource}>
  {value => <ExampleComponent subscribedValue={value} />}
</Subscription>;
