const Timer = () => {
  const [seconds, setSeconds] = React.useState(0);

  const tick = () => {
    setSeconds(sec => sec + 1);
  };

  React.useEffect(() => {
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
};

ReactDOM.render(<Timer />, document.getElementById('timer-example'));
