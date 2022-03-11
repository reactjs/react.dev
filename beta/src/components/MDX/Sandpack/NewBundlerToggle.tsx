import {useEffect, useState} from 'react';

/**
 * Temp component: testing purposes only
 */
export const NewBundlerToggle = () => {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(window.localStorage.getItem('sandpack-new-bundler') === 'true');
  }, []);

  const onChange = () => {
    const value = window.localStorage.getItem('sandpack-new-bundler');

    window.localStorage.setItem(
      'sandpack-new-bundler',
      value === 'true' ? 'false' : 'true'
    );

    window.location.reload();
  };

  return (
    <label>
      <input onChange={onChange} checked={state} type="checkbox" /> Active new
      bundler (for all pages)
    </label>
  );
};
