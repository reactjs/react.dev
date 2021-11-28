import React, {useState} from 'react';
import {Logo} from 'components/Logo';
import {Heart} from 'components/Heart';
import ReactFlow, {Controls, Handle, Background} from 'react-flow-renderer';
import {MenuProvider} from 'components/useMenu';
import {RouteItem, SidebarContext} from 'components/Layout/useRouteMeta';
import {Nav} from 'components/Layout/Nav';
import {Sidebar} from 'components/Layout/Sidebar';
import {Footer} from 'components/Layout/Footer';
import {initialElements} from '../../flow';
import sidebarHome from '../../sidebarHome.json';

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const getNodeClasses = (type) => {
  switch (type) {
    case 'childNode':
      return 'border rounded-lg bg-gray-300 p-4 flex items-center  dark:bg-purple-50 dark:border-purple-50';
    case 'subChildNode':
      return 'border-2 rounded-lg bg-gray-300 dark:bg-card-dark border-blue-50 p-4 flex items-center';
    case 'headingNode':
      return 'border rounded-lg border-blue-60 bg-white p-4 flex items-center dark:bg-blue-50 dark:border-gwreen-900';
    case 'leafNode':
      return 'border rounded-lg bg-white border-gray-500 p-4 flex items-center dark:bg-blue-40 dark:bg-opacity-8';
  }
};

const Node = ({data: {label, edge, id}, type}) => {
  const read = JSON.parse(localStorage.getItem('visitedPages')).includes(id);
  const favourites = JSON.parse(localStorage.getItem('favourites')).includes(
    id
  );

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
      <div className={getNodeClasses(type)}>
        <h3 className="strong text-xl">{label}</h3>
        {read && <ReadIcon />}

        {favourites && (
          <div className="text-red-600 ml-4 h-8 w-8">
            <Heart fill />
          </div>
        )}
      </div>
    </>
  );
};
const ReadIcon = () => (
  <div className="ml-4 h-8 w-8 bg-green-300 text-green-700 rounded-full flex items-center justify-center">
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </div>
);

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
      <div className="border rounded-lg dark:bg-card-dark border-gray-500 p-4 flex items-center">
        <Logo className="text-link w-12 sm:mb-0 h-12 p-2 animate-spin-slow " />
        <h2 className="text-2xl strong"> {data.label}</h2>
      </div>

      <Handle
        type="source"
        position="bottom"
        style={{background: '#555'}}
        isConnectable={true}
      />
    </>
  );
};

const nodeTypes = {
  reactNode: ReactNode,
  headingNode: Node,
  childNode: Node,
  leafNode: Node,
  subChildNode: Node,
};

const RoadMap = () => {
  const [showTip, toggleTip] = useState(true);
  const [elements, setElements] = useState(initialElements);
  return (
    <MenuProvider>
      <SidebarContext.Provider value={sidebarHome}>
        <div className="h-auto lg:h-screen flex flex-row">
          <div className="no-bg-scrollbar h-auto lg:h-full lg:overflow-y-scroll fixed flex flex-row lg:flex-col py-0 top-0 left-0 right-0 lg:max-w-xs w-full shadow lg:shadow-none z-50">
            <Nav />
            <Sidebar />
          </div>
          {showTip && (
            <div
              className="fixed z-10 inset-0 overflow-y-auto"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true">
              <div className="flex sm:items-end items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  aria-hidden="true"></div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true">
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white dark:bg-wash-dark dark:text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div
                        className="h-10 w-10 cursor-pointer right-0 absolute text-gray-500 block sm:hidden"
                        onClick={() => toggleTip(false)}>
                        <svg
                          viewBox="0 0 30 30"
                          width="30"
                          height="30"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                      </div>
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-10 sm:mx-0 sm:h-10 sm:w-10 text-blue-40 font-bold">
                        !
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                          id="modal-title">
                          Quick tips
                        </h3>
                        <div className="mt-2">
                          <ul className="list-disc list-inside dark:text-white text-gray-700">
                            <li className="text-sm">
                              You can choose between reading sequentially or
                              land directly in the topic that you need by double
                              clicking on the topic
                            </li>
                            <li className="text-sm">
                              When you have read a page. We will remember it for
                              you the next time
                            </li>
                            <li className="text-sm">
                              The flow has no directions so feel free to
                              discover various tracks
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="h-10 w-10 cursor-pointer text-gray-500 hidden sm:block"
                        onClick={() => toggleTip(false)}>
                        <svg
                          viewBox="0 0 30 30"
                          width="30"
                          height="30"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-1 w-full h-full self-stretch">
            <div className="w-full min-w-0 absolute">
              <ReactFlow
                nodeTypes={nodeTypes}
                elements={elements}
                onLoad={onLoad}
                onNodeDoubleClick={(data, node) => window.open(node.data.path)}
                onNodeDragStop={(data, node) => console.log(node)}
                // The class names are getting over written so for now leave it as inline
                style={{height: '100vh', width: '100%'}}>
                {/* <MiniMap
                  nodeStrokeColor={(n) => {
                    if (n.style?.background) return n.style.background;
                    if (n.type === 'leafNode') return '#0041d0';
                    if (n.type === 'childNode') return '#ff0072';
                    if (n.type === 'headingNode') return '#1a192b';

                    return '#eee';
                  }}
                /> */}
                <Controls />
                <Background
                  color="#aaa"
                  gap={24}
                  className="dark:bg-wash-dark h-screen w-screen"
                />
              </ReactFlow>
              <Footer />
              {/* </main> */}
            </div>
          </div>
        </div>
      </SidebarContext.Provider>
    </MenuProvider>
  );
};

export default RoadMap;
