export const initialElements = [
  {
    id: '1',
    type: 'reactNode',
    data: {
      path: '/',
      label: 'React',
      id: '',
    },
    position: {
      x: 490,
      y: -200,
    },
  },
  {
    id: '2',
    type: 'headingNode',
    data: {
      path: '/learn',
      label: '📖 Learn react',
      edge: ['top'],
      id: 'learn',
    },
    position: {
      x: 480,
      y: 50,
    },
  },
  {
    id: 'easy',
    type: 'headingNode',
    data: {
      label: 'Easy',
      edge: ['top'],
    },
    position: {
      x: 280,
      y: 200,
    },
  },
  {
    id: '3',
    type: 'childNode',
    data: {
      path: '/learn/installation',
      label: 'Adding React',
      edge: ['right'],
      id: 'installation',
    },
    position: {
      x: 50,
      y: 100,
    },
  },
  {
    id: '4',
    type: 'leafNode',
    data: {
      path: '/learn/start-a-new-react-project',
      label: 'Create React App',
      edge: ['right'],
      id: 'start-a-new-react-project',
    },
    position: {
      x: -200,
      y: 0,
    },
  },
  {
    id: '5',
    type: 'leafNode',
    data: {
      path: '/learn/add-react-to-a-website',
      label: 'Using via cdn',
      edge: ['right'],
      id: 'add-react-to-a-website',
    },
    position: {
      x: -200,
      y: 150,
    },
  },
  {
    id: '6',
    type: 'leafNode',
    data: {
      path: '/learn/writing-markup-with-jsx',
      label: 'JSX',
      edge: ['right'],
      id: 'writing-markup-with-jsx',
    },
    position: {
      x: -100,
      y: 250,
    },
  },
  {
    id: '7',
    type: 'childNode',
    data: {
      path: '/learn/your-first-component',
      label: 'Components',
      edge: ['right'],
      id: 'your-first-component',
    },
    position: {
      x: 50,
      y: 350,
    },
  },
  {
    id: '8',
    type: 'leafNode',
    data: {
      path: '/learn/importing-and-exporting-components',
      label: 'Import and Export',
      edge: ['right'],
      id: 'importing-and-exporting-components',
    },
    position: {
      x: -200,
      y: 350,
    },
  },
  {
    id: '9',
    type: 'leafNode',
    data: {
      path: '/learn/passing-props-to-a-component',
      label: 'Props',
      edge: ['right'],
      id: 'passing-props-to-a-component',
    },
    position: {
      x: -100,
      y: 450,
    },
  },
  {
    id: '10',
    type: 'leafNode',
    data: {
      path: '/learn/conditional-rendering',
      label: 'Conditional rendering',
      edge: ['right'],
      id: 'conditional-rendering',
    },
    position: {
      x: -200,
      y: 550,
    },
  },
  {
    id: '11',
    type: 'leafNode',
    data: {
      path: '/learn/rendering-lists',
      label: 'Rendering lists',
      edge: ['right'],
      id: 'rendering-lists',
    },
    position: {
      x: -150,
      y: 650,
    },
  },
  {
    id: '12',
    type: 'leafNode',
    data: {
      path: '/learn/keeping-components-pure',
      label: 'Keeping components pure',
      edge: ['right'],
      id: 'keeping-components-pure',
    },
    position: {
      x: -250,
      y: 750,
    },
  },
  {
    id: '13',
    type: 'childNode',
    data: {
      path: '/learn/adding-interactivity',
      label: 'Interactivity',
      edge: ['right'],
      id: 'adding-interactivity',
    },
    position: {
      x: 50,
      y: 900,
    },
  },
  {
    id: '14',
    type: 'leafNode',
    data: {
      path: '/learn/responding-to-events',
      label: 'Events',
      edge: ['right'],
      id: 'responding-to-events',
    },
    position: {
      x: -100,
      y: 850,
    },
  },
  {
    id: '15',
    type: 'subChildNode',
    data: {
      path: '/reference/usestate',
      label: 'Using states',
      edge: ['right'],
      id: 'usestate',
    },
    position: {
      x: -150,
      y: 950,
    },
  },
  {
    id: '16',
    type: 'leafNode',
    data: {
      path: '/learn/state-a-components-memory',
      label: "State as a component's memory",
      edge: ['right'],
      id: 'state-a-components-memory',
    },
    position: {
      x: -550,
      y: 900,
    },
  },
  {
    id: '17',
    type: 'leafNode',
    data: {
      path: '/learn/state-as-a-snapshot',
      label: 'State as a snapshot',
      edge: ['right'],
      id: 'state-as-a-snapshot',
    },
    position: {
      x: -450,
      y: 1000,
    },
  },
  {
    id: '18',
    type: 'leafNode',
    data: {
      path: '/learn/updating-objects-in-state',
      label: 'Updating Object in state',
      edge: ['right'],
      id: 'updating-objects-in-state',
    },
    position: {
      x: -450,
      y: 1100,
    },
  },
  {
    id: '19',
    type: 'leafNode',
    data: {
      path: '/learn/updating-arrays-in-state',
      label: 'Updating Array in state',
      edge: ['right'],
      id: 'updating-arrays-in-state',
    },
    position: {
      x: -450,
      y: 1200,
    },
  },
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  {
    id: 'e1-3',
    source: 'easy',
    target: '3',
    animated: true,
  },
  {
    id: 'e1-easy',
    source: '2',
    target: 'easy',
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    animated: true,
  },
  {
    id: 'e4-6',
    source: '7',
    target: '6',
    animated: true,
  },
  {
    id: 'eeasy-7',
    source: 'easy',
    target: '7',
    animated: true,
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    animated: true,
  },
  {
    id: 'e7-9',
    source: '7',
    target: '9',
    animated: true,
  },
  {
    id: 'e7-10',
    source: '7',
    target: '10',
    animated: true,
  },
  {
    id: 'e7-11',
    source: '7',
    target: '11',
    animated: true,
  },
  {
    id: 'e7-12',
    source: '7',
    target: '12',
    animated: true,
  },
  {
    id: 'eeasy-13',
    source: 'easy',
    target: '13',
    animated: true,
  },
  {
    id: 'e13-14',
    source: '13',
    target: '14',
    animated: true,
  },
  {
    id: 'e13-15',
    source: '13',
    target: '15',
    animated: true,
  },
  {
    id: 'e15-16',
    source: '15',
    target: '16',
    animated: true,
  },
  {
    id: 'e15-17',
    source: '15',
    target: '17',
    animated: true,
  },
  {
    id: 'e15-18',
    source: '15',
    target: '18',
    animated: true,
  },
  {
    id: 'e15-19',
    source: '15',
    target: '19',
    animated: true,
  },
];
