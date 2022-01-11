//showering a little code from stack overflow https://stackoverflow.com/questions/5300938/calculating-the-position-of-points-in-a-circle/5301049#5301049

const getPosition = (center, radius, index, length, level) => {
  let angle,
    slice,
    existingAngle = center.angle || 0;
  if (level !== 1) {
    slice = Math.PI / (length === 1 ? 2 : length - 1);
    angle = slice * index + existingAngle - (90 * Math.PI) / 180;
  } else {
    slice = (2 * Math.PI) / length;
    angle = slice * index;
  }

  const newX = Math.floor(center.x + radius * Math.cos(angle));
  const newY = Math.floor(center.y + radius * Math.sin(angle));

  return {x: newX, y: newY, angle};
};

export default getPosition;
