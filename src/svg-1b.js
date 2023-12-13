import {
  createNoiseGrid,
  createVoronoiTessellation,
  random,
  randomBias,
  map,
  spline,
  pointsInPath
} from '@georgedoescode/generative-utils';

import { mySettings } from './settingsManager.js';

// export the svgGenerator function
export function svgGenerator(svgObj) {
  const { width, height } = svgObj.viewbox();
  svgObj.clear();

  // find the center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = height / 2;


  // draw a circle at the center of the canvas
  // svgObj.circle(radius).center(centerX, centerY).fill("#fff").stroke("#f00");

  // loop through the number of points we want to draw
  let numPoints = 500;

  // check if the #num-points input exists
  const numPointsEl = document.getElementById("num-points");
  if (numPointsEl) {
    // update the number of points
    numPoints = numPointsEl.value;
  }

  let points = [];
  // loop through the number of points we want to draw
  for (let i = 0; i < numPoints; i++) {
    // get a random angle between 0 and 2PI
    const angle = random(0, Math.PI * 2);
    // get a random radius between 0 and the radius of the circle
    const r = random(0, radius);
    // get the x and y coordinates of the point
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);

    // add the point to the points array
    points.push({ x, y });
  }


  // draw a voronoi diagram
  const tessellation = createVoronoiTessellation({ width, height, points, iterations: 6 });

  let debug = false;
  // check if the #debug input exists
  const debugEl = document.getElementById("debug");
  if (debugEl) {
    // update the number of points
    debug = debugEl.checked;
  }



  tessellation.cells.forEach((cell) => {
    if (debug) {
      svgObj.polygon(cell.points).fill("none").stroke("#999999");

      svgObj
        .circle(cell.innerCircleRadius * 1)
        .cx(cell.centroid.x)
        .cy(cell.centroid.y)
        .stroke("#f00")
        .fill("none").scale(0.5);
      console.log(cell);

    } else {

      // figure out the angle of the triangle based on the center of the page and the center of the cell
      const pageCenterX = width / 2;
      const pageCenterY = height / 2;

      const deltaX = pageCenterX - cell.centroid.x;
      const deltaY = pageCenterY - cell.centroid.y;

      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

      // get the #rotation input, if it exists
      const rotationEl = document.getElementById("rotation");


      let angleUpdate = 0;
      if (rotationEl) {
        // update the rotation
        angleUpdate = rotationEl.value;
      }

      let updatedAngle = angle + Number(angleUpdate);

      svgObj.path('M 0 0 L ' + cell.innerCircleRadius + ' 0 L ' + cell.innerCircleRadius/2 + ' ' + cell.innerCircleRadius + ' z').fill("#fff").stroke("#000").x(cell.centroid.x - (cell.innerCircleRadius/2)).y(cell.centroid.y- (cell.innerCircleRadius/2.5)).rotate(updatedAngle);
    }
  });
}


// create a settings manager instance

// initialize the settings manager
mySettings.init({ settingsElement: '#settings' });

// add settings to the settings manager

mySettings.add(
  {
    sltype: 'sl-input',
    name: 'num-points',
    options: {
      label: 'Number of points',
      type: 'number',
      min: 1,
      max: 1000,
      value: 500,
      step: 1,
      size: 'small',
      helpText: 'The number of points to draw'
    }
  }

);
/*,
  {
    sltype: 'sl-input',
    name: 'rotation',
    options: {
      label: 'Rotation',
      type: 'number',
      min: -360,
      max: 360,
      value: 0,
      step: 1,
      size: 'small',
      helpText: 'The rotation of the triangles'
    }
  },

  {
    sltype: 'sl-input',
    name: 'debug',
    options: {
      label: 'Debug',
      type: 'checkbox',
      value: false,
      size: 'small',
      helpText: 'Show debug lines'
    }
  }

  */
