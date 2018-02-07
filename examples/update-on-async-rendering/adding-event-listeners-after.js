// After
class ExampleComponent extends React.Component {
  // highlight-range{1-3}
  state = {
    subscribedValue: this.props.dataSource.value,
  };

  // highlight-range{1-18}
  componentDidMount() {
    // Event listeners are only safe to add after mount,
    // So they won't leak if mount is interrupted or errors.
    this.props.dataSource.subscribe(
      this._onSubscriptionChange
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

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this._onSubscriptionChange
    );
  }

  _onSubscriptionChange = subscribedValue => {
    this.setState({subscribedValue});
  };
}
