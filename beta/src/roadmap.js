import getPosition from 'utils/generatePositions';
import sideBarHome from './sidebarHome.json';
import sideBarLearn from './sidebarLearn.json';
import sideBarReference from './sidebarReference.json';
const nodeType = (level) => {
  switch (level) {
    case 1:
      return 'headingNode';
    case 2:
      return 'childNode';
    case 3:
      return 'leafNode';
  }
};
const nodeDistance = (level) => {
  switch (level) {
    case 1:
      return 400;
    case 2:
      return 1200;
    case 3:
      return 500;
  }
};
const generateNodeContent = ({
  nodesContent,
  parentPosition,
  level,
  nodesJSON,
  index,
}) => {
  let nodeObject = {};
  let currentPosition = getPosition(
    parentPosition,
    nodeDistance(level),
    index,
    nodesJSON.length,
    level
  );
  nodeObject.position = currentPosition;
  nodeObject = {
    ...nodeObject,
    id: nodesContent?.title?.split(' ').join('-').toLowerCase(),
    data: {
      label: `${nodesContent.title}`,
    },
    parentPosition,
    siblingsNodes: nodesJSON.length,
    level: level - 1,
    type: nodeType(level),
  };

  return nodeObject;
};
let allNodes = [];
const createFlowNodes = (
  nodesJSON,
  level = 0,
  parentPosition = {x: 0, y: 0}
) => {
  // we will differentiate the nodes based on its depth
  level = level + 1;
  //routes are basically arrays so we map every route into a react flow node
  nodesJSON.map((nodesContent, index) => {
    let newNode;
    newNode = generateNodeContent({
      nodesContent,
      parentPosition,
      level,
      nodesJSON,
      index,
    });
    console.log(
      'parent position is -->',
      parentPosition,
      ' my position is ',
      newNode.position,
      'my name is ',
      newNode.id,
      ' my content are',
      nodesContent,
      ' my level is',
      level
    );

    // console.log(
    //   'harish kumar ',
    //   nodesContent.title,
    //   nodesContent.routes,
    //   newNode.position,
    //   parentPosition
    // );
    if (nodesContent.routes) {
      // allNodes.push(newNode);

      // console.log('harish here', nodesContent);
      nodesContent?.title && allNodes.push(newNode);
      createFlowNodes(nodesContent.routes, level, newNode.position);
    } else {
      // console.log('harish ', nodesContent);
      allNodes.push(newNode);
    }
    // if (nodesContent.title) {
    // }
  });
};
// createFlowNodes([
//   {title: 'Home'},
//   {title: 'Learn', routes: sideBarLearn.routes},
//   {title: 'API reference'},
// ]);
createFlowNodes(sideBarHome.routes);
createFlowNodes(sideBarLearn.routes);
createFlowNodes(sideBarReference.routes);
// generatePositions(allNodes, {x: 0, y: 0}, 100);

const roadMapData = [
  {
    id: '1',
    type: 'mainNode',
    data: {label: 'React'},
    position: {x: 0, y: 0},
  },
  ...allNodes,

  // {id: 'e1-3', source: '1', target: '2', animated: true},
  // {id: 'e1-2', source: '2', target: '3', animated: true},
];
console.log('harish kumar', roadMapData);

export default roadMapData;
