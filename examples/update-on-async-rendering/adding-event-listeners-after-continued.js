// After
class ExampleComponent extends React.Component {
  // highlight-range{1-3}
  state = {
    subscribedValue: this.props.dataSource.value,
  };
  // highlight-line
  // highlight-range{1-3}
  componentDidMount() {
    this.finalizeSubscription();
  }
  // highlight-line
  // highlight-range{1-11}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.dataSource !== prevProps.dataSource) {
      // Similar to adding subscriptions,
      // It's only safe to unsubscribe during the commit phase.
      prevProps.dataSource.unsubscribe(
        this.handleSubscriptionChange
      );

      this.finalizeSubscription();
    }
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  // highlight-range{1-18}
  finalizeSubscription() {
    // Event listeners are only safe to add during the commit phase,
    // So they won't leak if render is interrupted or errors.
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );

    // External values could change between render and mount,
    // In some cases it may be important to handle this case.
    if (
      this.state.subscribedValue !==
      this.props.dataSource.value
    ) {
      this.setState({
        subscribedValue: this.props.dataSource.value,
      });
    }
  }

  handleSubscriptionChange = subscribedValue => {
    this.setState({subscribedValue});
  };
}
