import React, {useState, useEffect} from 'react';
import {colors} from 'theme';

const Toggler = () => {
  useEffect(() => {
    if (localStorage.getItem('theme')) {
      document.body.className = localStorage.getItem('theme');
      setTheme(localStorage.getItem('theme'));
    }
  }, []);

  let [theme, setTheme] = useState('light');

  let handleToggle = () => {
    let newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
    setTheme(newTheme);
  };

  let whereToExist = () => (theme === 'light' ? {left: '6%'} : {left: '53%'});

  return (
    <button
      style={{
        background: colors.lighter,
        outline: 'none',
        border: `1px solid ${colors.lighter}`,
        display: 'flex',
        borderRadius: '20px',
        cursor: 'pointer',
        position: 'relative',
        alignItems: 'center',
        padding: '5px',
        gap: '2px',
      }}
      onClick={handleToggle}>
      <Icon icon={'🌜'} />

      <div
        style={{
          position: 'absolute',
          background: 'white',
          height: '23px',
          width: '23px',
          borderRadius: '50%',
          transition: '0.5s',
          ...whereToExist(),
        }}></div>
      <Icon icon={'🌞'} />
    </button>
  );
};

const Icon = ({icon}) => <span style={{fontSize: '18px'}}> {icon} </span>;

export default Toggler;
