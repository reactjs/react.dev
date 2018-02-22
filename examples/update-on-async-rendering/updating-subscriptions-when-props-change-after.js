// After
class ExampleComponent extends React.Component {
  // highlight-range{1-4}
  state = {
    dataSource: this.props.dataSource,
    subscribedValue: this.props.dataSource.value,
  };
  // highlight-line
  // highlight-range{1-8}
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataSource !== prevState.dataSource) {
      return {
        dataSource: nextProps.dataSource,
        subscribedValue: nextProps.dataSource.value,
      };
    }
  }
  // highlight-line
  // highlight-range{1-3}
  componentDidMount() {
    this.finalizeSubscription();
  }
  // highlight-line
  // highlight-range{1-11}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.dataSource !== prevState.dataSource) {
      // Similar to adding subscriptions,
      // It's only safe to unsubscribe during the commit phase.
      prevState.dataSource.unsubscribe(
        this.handleSubscriptionChange
      );

      this.finalizeSubscription();
    }
  }

  componentWillUnmount() {
    this.state.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  // highlight-range{1-14}
  finalizeSubscription() {
    // Event listeners are only safe to add during the commit phase,
    // So they won't leak if render is interrupted or errors.
    this.state.dataSource.subscribe(
      this.handleSubscriptionChange
    );

    // External values could change between render and mount,
    // In some cases it may be important to handle this case.
    const subscribedValue = this.state.dataSource.value;
    if (subscribedValue !== this.state.subscribedValue) {
      this.setState({subscribedValue});
    }
  }
  // highlight-line
  // highlight-range{1-13}
  handleSubscriptionChange = dataSource => {
    this.setState(state => {
      // If this event belongs to the current data source, update.
      // Otherwise we should ignore it.
      if (dataSource === state.dataSource) {
        return {
          subscribedValue: dataSource.value,
        };
      }

      return null;
    });
  };
}
