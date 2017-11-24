import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function ImageCarousel(props) {
  return (
    <div>
      <ReactCSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {/* highlight-range{1-4} */}
        <img
          src={props.imageSrc}
          key={props.imageSrc}
        />
      </ReactCSSTransitionGroup>
    </div>
  );
}
