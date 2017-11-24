class MyComponent extends Component {
  render() {
    return (
      // highlight-range{3,4}
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}>
        <h1>Fading at Initial Mount</h1>
      </ReactCSSTransitionGroup>
    );
  }
}
