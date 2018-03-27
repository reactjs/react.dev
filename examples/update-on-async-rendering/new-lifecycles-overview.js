class Example extends React.Component<
  Props,
  State,
  Snapshot
> {
  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): $Shape<State> | null {
    // ...
  }

  getSnapshotBeforeUpdate(
    prevProps: Props,
    prevState: State
  ): Snapshot {
    // ...
  }
}
