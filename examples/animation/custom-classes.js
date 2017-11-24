<div>
  <ReactCSSTransitionGroup
    transitionName={{
      enter: 'enter',
      enterActive: 'enterActive',
      leave: 'leave',
      leaveActive: 'leaveActive',
      appear: 'appear',
      appearActive: 'appearActive',
    }}>
    {item}
  </ReactCSSTransitionGroup>
  <ReactCSSTransitionGroup
    transitionName={{
      enter: 'enter',
      leave: 'leave',
      appear: 'appear',
    }}>
    {item2}
  </ReactCSSTransitionGroup>
</div>;
