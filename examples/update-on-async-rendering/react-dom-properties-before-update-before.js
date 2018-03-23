class ScrollingList extends React.Component {
  listRef = null;
  prevScrollHeight = null;

  // highlight-range{1-7}
  componentWillUpdate(nextProps, nextState) {
    // Are we adding new items to the list?
    // Capture the current height of the list so we can adjust scroll later.
    if (this.props.list.length < nextProps.list.length) {
      this.prevScrollHeight = this.listRef.scrollHeight;
    }
  }

  // highlight-range{1-9}
  componentDidUpdate(prevProps, prevState) {
    // If prevScrollHeight is set, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    if (this.prevScrollHeight !== null) {
      this.listRef.scrollTop +=
        this.listRef.scrollHeight - this.prevScrollHeight;
      this.prevScrollHeight = null;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
