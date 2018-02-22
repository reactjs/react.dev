// Before
class ExampleComponent extends React.Component {
  // highlight-range{1-10}
  componentWillMount() {
    this.setState({
      subscribedValue: this.props.dataSource.value,
    });

    // This is not safe; it can leak!
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
