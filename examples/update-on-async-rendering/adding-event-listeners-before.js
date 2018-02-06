// Before
class ExampleComponent extends React.Component {
  // highlight-range{1-11}
  componentWillMount() {
    this.setState({
      subscribedValue: this.props
        .dataSource.value,
    });

    // This is not safe; it can leak!
    this.props.dataSource.subscribe(
      this._onSubscriptionChange
    );
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
