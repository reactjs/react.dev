---
id: update-nested-state-properties
title: Update Nested State Properties
permalink: docs/update-nested-state-properties.html
redirect_from:
  - "docs/updatenestedstateproperties.html"
---

To update nested properties in state we can use spread operator to copy our previous properties in the state and and then set the changed properties with changed values

```javascript
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
```