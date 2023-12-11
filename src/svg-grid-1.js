import {
  createNoiseGrid,
  createVoronoiTessellation,
  createQtGrid,
  random,
  randomBias,
  map,
  spline,
  pointsInPath
} from '@georgedoescode/generative-utils';

// export the svgGenerator function
export function svgGenerator(svgObj) {
  const { width, height } = svgObj.viewbox();
  svgObj.clear();

  let debug = false;
   // check if the #debug input exists
  const debugEl = document.getElementById("debug");
  if (debugEl) {
    // update the number of points
    debug = debugEl.checked;
  }


  let closeShape = false;
   // check if the #closeShape input exists
  const closeShapeEl = document.getElementById("close-shape");
  if (closeShapeEl) {
    // update the number of points
    closeShape = closeShapeEl.checked;
  }


   let quatTreeLevels = 1;
   // check if the #closeShape input exists
  const quatTreeLevelsEl = document.getElementById("quads-tree-level");
  if (quatTreeLevelsEl) {
    // update the number of quatTreeLevels
    quatTreeLevels = quatTreeLevelsEl.value;
    console.log('quatTreeLevels',quatTreeLevels);

  }

  // find the center of the canvas
  // const centerX = width / 2;
  // const centerY = height / 2;
  // const radius = height / 2;


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

  // let points = [];
  // // loop through the number of points we want to draw
  // for (let i = 0; i < numPoints; i++) {
  //   // get a random angle between 0 and 2PI
  //   const angle = random(0, Math.PI * 2);
  //   // get a random radius between 0 and the radius of the circle
  //   const r = random(0, radius);
  //   // get the x and y coordinates of the point
  //   const x = centerX + r * Math.cos(angle);
  //   const y = centerY + r * Math.sin(angle);

  //   // add the point to the points array
  //   points.push({ x, y });
  // }


  const focus = {
  x: random(0, width),
  y: random(0, height),
};

const points = [...Array(numPoints)].map(() => {
  return {
    x: randomBias(0, width, focus.x, 1),
    y: randomBias(0, height, focus.y, 1),
    width: 1,
    height: 1,
  };
});
  // draw a circle on each point

  // points.forEach((point) => {
  //   svgObj.circle(2).cx(point.x).cy(point.y).fill("#fff").stroke("#f00");
  // });






  const grid = createQtGrid({
  width,
  height,
  points,
  gap: 0,
  maxQtLevels: quatTreeLevels,
  });


  // make a new array with the points at the center of each grid element
  const gridCenterPoints = grid.areas.map((area) => {
    return {
      x: area.x + area.width / 2,
      y: area.y + area.height / 2,
    };
  });


  grid.areas.forEach((area) => {


  // if (debug) {

  //     svgObj
  //       .circle(4)
  //       .cx(area.x)
  //       .cy(area.y)
  //       .stroke("#f00")
  //       .fill("none").scale(0.5);
  //     console.log(area);

  //   }

    if (debug) {

      svgObj
        .rect(area.width, area.height)
        .x(area.x)
        .y(area.y)
        .fill('none')
        .stroke('#111');
    }

  });


  // draw a circle on each point
  if (debug) {
    gridCenterPoints.forEach((point) => {
      svgObj.circle(2).cx(point.x).cy(point.y).fill("#fff").stroke("#f00");
    });

  }



  // // draw a voronoi diagram
  // const tessellation = createVoronoiTessellation({ width, height, points, iterations: 6 });





  // tessellation.cells.forEach((cell) => {
  //   if (debug) {
  //     svgObj.polygon(cell.points).fill("none").stroke("#999999");

  //     svgObj
  //       .circle(cell.innerCircleRadius * 1)
  //       .cx(cell.centroid.x)
  //       .cy(cell.centroid.y)
  //       .stroke("#f00")
  //       .fill("none").scale(0.5);
  //     console.log(cell);

  //   } else {

  //     // figure out the angle of the triangle based on the center of the page and the center of the cell
  //     const pageCenterX = width / 2;
  //     const pageCenterY = height / 2;

  //     const deltaX = pageCenterX - cell.centroid.x;
  //     const deltaY = pageCenterY - cell.centroid.y;

  //     const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  //     // // get the #rotation input, if it exists
  //     // const rotationEl = document.getElementById("rotation");


  //     // let angleUpdate = 0;
  //     // if (rotationEl) {
  //     //   // update the rotation
  //     //   angleUpdate = rotationEl.value;
  //     // }

  //     // let updatedAngle = angle + Number(angleUpdate);

  //     // svgObj.path('M 0 0 L ' + cell.innerCircleRadius + ' 0 L ' + cell.innerCircleRadius/2 + ' ' + cell.innerCircleRadius + ' z').fill("#fff").stroke("#000").x(cell.centroid.x - (cell.innerCircleRadius/2)).y(cell.centroid.y- (cell.innerCircleRadius/2.5)).rotate(updatedAngle);
  //   }
  // });



  // spine through the gridCenterPoints
const splinePoints = spline(gridCenterPoints, 0.8, closeShape);
// draw a path through the spline points
svgObj.path(splinePoints).stroke({
      width: 2,
      color: '#000'
    })
    .fill('transparent');
}









// create a container for the setting inputs to live inside
const settingsContainer = document.getElementById("settings");


// create a container for the setting fields
const settingsInnerContainer = document.createElement("div");

settingsInnerContainer.classList.add("settings-container");


// text black so it's visible on the white background
settingsInnerContainer.style.color = "#000";

// display flex flexcolumn so the inputs stack on top of each other
settingsInnerContainer.style.display = "flex";
settingsInnerContainer.style.flexDirection = "column";
// set gap to 1rem so the inputs are spaced out
settingsInnerContainer.style.gap = "1.5rem";

// add the container to the settings container
settingsContainer.appendChild(settingsInnerContainer);


// add the container to the page
document.body.appendChild(settingsContainer);

// make a container for the number of points input
const numPointsContainer = document.createElement("div");

// text black so it's visible on the white background
numPointsContainer.style.color = "#000";

// display flex flexcolumn so the inputs stack on top of each other
numPointsContainer.style.display = "flex";
numPointsContainer.style.flexDirection = "column";


// add the container to the settings container
settingsInnerContainer.appendChild(numPointsContainer);

// // create a label for the number of points
// const numPointsLabel = document.createElement("label");
// numPointsLabel.for = "num-points";
// numPointsLabel.innerHTML = "Number of triangles, 1-2000";
// // add the label to the page
// numPointsContainer.appendChild(numPointsLabel);

// create a text field to the page to set the number of points
const numPointsEl = document.createElement("sl-range");
numPointsEl.id = "num-points";
numPointsEl.label = "Number of Cells";
numPointsEl.helpText = "Adjust the number of cells in the image."
numPointsEl.value = 75;
numPointsEl.min = 1;
numPointsEl.max = 2000;
// add the text field to the page
numPointsContainer.appendChild(numPointsEl);

numPointsEl.addEventListener("change", () => {
  // update the number of points
  numPoints = numPointsEl.value;
  // regenerate the SVG
  svgGenerator(svgGenerated);
});

// create a container for the rotation input
const quatTreeLevelsContainer = document.createElement("div");

// create a range input for the quatTreeLevels
const quatTreeLevelsEl = document.createElement("sl-range");
quatTreeLevelsEl.id = "quads-tree-level";
quatTreeLevelsEl.label = "Max Quad Tree Levels";
quatTreeLevelsEl.helpText = "The lower the number, the less complex the image."
quatTreeLevelsEl.value = 3;
quatTreeLevelsEl.min = 0;
quatTreeLevelsEl.max = 20;

// add the text field to the page
quatTreeLevelsContainer.appendChild(quatTreeLevelsEl);
// add the container to the settings container
settingsInnerContainer.appendChild(quatTreeLevelsContainer);


// create a debug checkbox
const closeShapeToggle = document.createElement("sl-checkbox");
closeShapeToggle.id = "close-shape";
closeShapeToggle.innerHTML = "Check to close the shape";
closeShapeToggle.checked = true;
// add the checkbox to the page
settingsInnerContainer.appendChild(closeShapeToggle);


// create a debug checkbox
const debugEl = document.createElement("sl-checkbox");
debugEl.id = "debug";
debugEl.innerHTML = "Debug";
debugEl.checked = false;
// add the checkbox to the page
settingsInnerContainer.appendChild(debugEl);

// create a sl-range for the volume
//<sl-range label="Volume" help-text="Controls the volume of the current song." min="0" max="100"></sl-range>
// const volumeContainer = document.createElement("div");
// const volumeInput = document.createElement("sl-range");
// volumeInput.label = "Volume";
// volumeInput = "Controls the volume of the current song.";
// volumeInput.min = 0;
// volumeInput.max = 100;
// volumeInput.value = 50;
// // add the volume input to the volume container
// volumeContainer.appendChild(volumeInput);
// // add the volume container to the settings container
// settingsContainer.appendChild(volumeContainer);
