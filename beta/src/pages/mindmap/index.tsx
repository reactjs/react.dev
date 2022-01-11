import React from 'react';
import ReactFlow, {Background, Handle} from 'react-flow-renderer';
import roadMap from '../../roadmap';
import {Logo} from 'components/Logo';

const ChildNode = ({data}) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        style={{background: '#555'}}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}
      />
      <div className="border rounded-lg bg-gray-500 p-4 flex items-center">
        <h3 className="strong text-xl">{data.label}</h3>
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

const HeadingNode = ({data}) => {
  return (
    <>
      <Handle
        type="target"
        position="top"
        style={{background: '#555'}}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}
      />
      <div className="border rounded-lg bg-yellow-500 p-4 flex items-center">
        <h3 className="strong text-xl">{data.label}</h3>
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

const LeafNode = ({data}) => {
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
        <h3 className="strong text-xl">{data.label}</h3>
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

const MainNode = ({data}) => {
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
const nodeTypes = {
  childNode: ChildNode,
  mainNode: MainNode,
  headingNode: HeadingNode,
  leafNode: LeafNode,
};

const MindMap = () => (
  <ReactFlow
    defaultPosition={[750, 500]}
    elements={roadMap}
    nodeTypes={nodeTypes}
    onNodeDragStop={(data) => console.log('harish', data)}>
    <Background color="#aaa" gap={16} />
  </ReactFlow>
);

export default MindMap;
