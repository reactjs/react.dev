function Timer() {
  const [seconds, setSeconds] = React.useState(0);
  const intervalRef = React.useRef();

  function tick() {
    setSeconds(seconds => seconds + 1);
  }

  React.useEffect(() => {
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return <div>Seconds: {seconds}</div>;
}

ReactDOM.render(<Timer />, document.getElementById('timer-example'));
