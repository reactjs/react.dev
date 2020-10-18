import React, {useState} from 'react';

export const UpdateNestedStateProperties = () => {
  const [state, setState] = useState({
    person: {
      personal: {
        name: 'john',
        address: 'new york',
      },
      professional: {
        company: 'facebook',
        salary: '75000',
      },
    },
  });
  const changeName = () =>
    setState({
      ...state,
      person: {
        ...state.person,
        personal: {...state.person.personal, name: 'harry'},
      },
    });

  return <button onClick={changeName}>Change Name</button>;
};
