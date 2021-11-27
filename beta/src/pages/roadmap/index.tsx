import React, {useState} from 'react';
import {Logo} from 'components/Logo';
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Handle,
  Background,
} from 'react-flow-renderer';

const initialElements = [
  {
    id: '1',
    type: 'reactNode',
    data: {
      path: '/',

      label: 'React',
    },
    position: {x: 475, y: -200},
  },
  {
    id: '2',
    type: 'headingNode',
    data: {
      path: '/learn',

      label: '📖 Learn react',
      edge: ['top'],
    },
    position: {x: 480, y: 50},
  },

  {
    id: 'easy',
    type: 'headingNode',
    data: {
      label: 'Easy',
      edge: ['top'],
    },
    position: {x: 280, y: 200},
  },

  {
    id: '3',
    type: 'childNode',
    data: {
      path: '/learn/installation',

      label: 'Adding React',
      edge: ['right', 'top', 'bottom'],
    },
    position: {x: 50, y: 100},
  },
  {
    id: '4',
    type: 'leafNode',
    data: {
      path: '/learn/start-a-new-react-project',

      label: 'Create React App',
      edge: ['right'],
    },
    position: {x: -200, y: 0},
  },
  {
    id: '5',
    type: 'leafNode',
    data: {
      path: '/learn/add-react-to-a-website',

      label: 'Using via cdn',
      edge: ['right'],
    },
    position: {x: -200, y: 150},
  },

  {
    id: '6',
    type: 'leafNode',
    data: {
      path: '/learn/writing-markup-with-jsx',

      label: 'JSX',
      edge: ['right'],
    },
    position: {x: -100, y: 250},
  },

  {
    id: '7',
    type: 'childNode',
    data: {
      path: '/learn/your-first-component',

      label: 'Components',
      edge: ['right', 'left', 'top', 'bottom'],
    },
    position: {x: 50, y: 350},
  },

  {
    id: '8',
    type: 'leafNode',
    data: {
      path: '/learn/importing-and-exporting-components',

      label: 'Import and Export',
      edge: ['right'],
    },
    position: {x: -200, y: 350},
  },

  {
    id: '9',
    type: 'leafNode',
    data: {
      path: '/learn/passing-props-to-a-component',

      label: 'Props',
      edge: ['right'],
    },
    position: {x: -100, y: 450},
  },

  {
    id: '10',
    type: 'leafNode',
    data: {
      path: '/learn/conditional-rendering',

      label: 'Conditional rendering',
      edge: ['right'],
    },
    position: {x: -200, y: 550},
  },

  {
    id: '11',
    type: 'leafNode',
    data: {
      path: '/learn/rendering-lists',

      label: 'Rendering lists',
      edge: ['right'],
    },
    position: {x: -150, y: 650},
  },

  {
    id: '12',
    type: 'leafNode',
    data: {
      path: '/learn/keeping-components-pure',

      label: 'Keeping components pure',
      edge: ['right'],
    },
    position: {x: -250, y: 750},
  },

  {
    id: '13',
    type: 'childNode',
    data: {
      path: '/learn/adding-interactivity',

      label: 'Interactivity',
      edge: ['right', 'top', 'bottom'],
    },
    position: {x: 50, y: 900},
  },

  {
    id: '14',
    type: 'leafNode',
    data: {
      path: '/learn/responding-to-events',

      label: 'Events',
      edge: ['right'],
    },
    position: {x: -100, y: 850},
  },

  {
    id: '15',
    type: 'subChildNode',
    data: {
      path: '/reference/usestate',

      label: 'Using states',
      edge: ['right'],
    },
    position: {x: -150, y: 950},
  },

  {
    id: '16',
    type: 'leafNode',
    data: {
      path: '/learn/state-a-components-memory',

      label: "State as a component's memory",
      edge: ['right'],
    },
    position: {x: -550, y: 900},
  },

  {
    id: '17',
    type: 'leafNode',
    data: {
      path: '/learn/state-as-a-snapshot',

      label: 'State as a snapshot',
      edge: ['right'],
    },
    position: {x: -450, y: 1000},
  },

  {
    id: '18',
    type: 'leafNode',
    data: {
      path: '/learn/updating-objects-in-state',

      label: 'Updating Object in state',
      edge: ['right'],
    },
    position: {x: -450, y: 1100},
  },

  {
    id: '19',
    type: 'leafNode',
    data: {
      path: '/learn/updating-arrays-in-state',

      label: 'Updating Array in state',
      edge: ['right'],
    },
    position: {x: -450, y: 1200},
  },

  {id: 'e1-2', source: '1', target: '2', animated: true},
  {id: 'e1-3', source: 'easy', target: '3', animated: true},
  {id: 'e1-easy', source: '2', target: 'easy', animated: true},

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
  // {
  //   id: 'e4-5',
  //   source: '4',
  //   target: '5',
  //   arrowHeadType: 'arrowclosed',
  //   label: 'edge with arrow head',
  // },
  // {
  //   id: 'e5-6',
  //   source: '5',
  //   target: '6',
  //   type: 'smoothstep',
  //   label: 'smooth step edge',
  // },
  // {
  //   id: 'e5-7',
  //   source: '5',
  //   target: '7',
  //   type: 'step',
  //   style: {stroke: '#f6ab6c'},
  //   label: 'a step edge',
  //   animated: true,
  //   labelStyle: {fill: '#f6ab6c', fontWeight: 700},
  // },
];

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const ChildNode = ({data: {label, edge}}) => {
  return (
    <>
      {edge?.map((direction, index) => (
        <Handle
          key={index}
          type="source"
          position={direction}
          id="a"
          style={{background: '#555'}}
          isConnectable={true}
        />
      ))}
      <div className="border rounded-lg bg-gray-300 p-4 flex items-center">
        <h3 className="strong text-xl">{label}</h3>
      </div>
    </>
  );
};
const SubChildNode = ({data: {label, edge}}) => {
  return (
    <>
      {edge?.map((direction, index) => (
        <Handle
          key={index}
          type="source"
          position={direction}
          id="a"
          style={{background: '#555'}}
          isConnectable={true}
        />
      ))}
      <div className="border-2 rounded-lg bg-gray-300 border-blue-50 p-4 flex items-center">
        <h3 className="strong text-xl">{label}</h3>
      </div>
    </>
  );
};

const HeadingNode = ({data: {label, edge}}) => {
  return (
    <>
      {edge?.map((direction, index) => (
        <Handle
          type="source"
          key={index}
          position={direction}
          id="a"
          style={{background: '#555'}}
          isConnectable={true}
        />
      ))}
      <div className="border rounded-lg border-blue-60 bg-white p-4 flex items-center">
        <h3 className="strong text-xl">{label}</h3>
      </div>
    </>
  );
};
const ReactNode = ({data}) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        style={{background: '#555'}}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}
      />
      <div className="border rounded-lg border-gray-500 p-4 flex items-center">
        <Logo className="text-link w-12 sm:mb-0 h-12 p-2 animate-spin-slow " />
        <h2 className="text-2xl strong"> {data.label}</h2>
      </div>

      <Handle
        type="source"
        position="bottom"
        id="a"
        style={{background: '#555'}}
        isConnectable={true}
      />
    </>
  );
};
const LeafNode = ({data: {label, edge}}) => {
  return (
    <>
      {edge?.map((direction, index) => (
        <Handle
          key={index}
          type="source"
          position={direction}
          id="a"
          style={{background: '#555'}}
          isConnectable={true}
        />
      ))}
      <div className="border rounded-lg bg-white border-gray-500 p-4 flex items-center">
        <h3 className="strong text-xl">{label}</h3>
      </div>
    </>
  );
};
const nodeTypes = {
  reactNode: ReactNode,
  headingNode: HeadingNode,
  childNode: ChildNode,
  leafNode: LeafNode,
  subChildNode: SubChildNode,
};

const OverviewFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      onNodeDoubleClick={(data, node) => window.open(node.data.path)}
      onNodeDragStop={(data) => console.log(data)}
      snapToGrid={true}
      snapGrid={[15, 15]}>
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'leafNode') return '#0041d0';
          if (n.type === 'childNode') return '#ff0072';
          if (n.type === 'headingNode') return '#1a192b';

          return '#eee';
        }}
      />
      <Controls />
      <Background color="#aaa" gap={8} />
    </ReactFlow>
  );
};

export default OverviewFlow;
