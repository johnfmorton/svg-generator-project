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
    closeShape = closeShapeEl.checked ? true : false;
  }


   let quatTreeLevels = 1;
   // check if the #closeShape input exists
  const quatTreeLevelsEl = document.getElementById("quads-tree-level");
  if (quatTreeLevelsEl) {
    // update the number of quatTreeLevels
    quatTreeLevels = quatTreeLevelsEl.value;
    console.log('quatTreeLevels',quatTreeLevels);

  }

  // loop through the number of points we want to draw
  let numPoints = 500;

  // check if the #num-points input exists
  const numPointsEl = document.getElementById("num-points");
  if (numPointsEl) {
    // update the number of points
    numPoints = numPointsEl.value;
  }

  // get the corner tension value
  let cornerTension = 1;
  const cornerTensionEl = document.getElementById("cornerTension");
  if (cornerTensionEl) {
    cornerTension = cornerTensionEl.value;
  }

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


  // spine through the gridCenterPoints
  // points, tension, closeShape
const splinePoints = spline(gridCenterPoints, cornerTension, closeShape);
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


// create a text field to the page to set the number of points
const numPointsEl = document.createElement("sl-range");
numPointsEl.id = "num-points";
numPointsEl.label = "Number of Points";
numPointsEl.helpText = "Affects complexity of underlying grid."
numPointsEl.value = 11;
numPointsEl.min = 35;
numPointsEl.max = 350;
// add the text field to the page
numPointsContainer.appendChild(numPointsEl);


// create a container for the rotation input
const quatTreeLevelsContainer = document.createElement("div");

// create a range input for the quatTreeLevels
const quatTreeLevelsEl = document.createElement("sl-range");
quatTreeLevelsEl.id = "quads-tree-level";
quatTreeLevelsEl.label = "Max Quad Tree Levels";
quatTreeLevelsEl.helpText = "The lower the number, the less complex the image."
quatTreeLevelsEl.value = 10;
quatTreeLevelsEl.min = 0;
quatTreeLevelsEl.max = 20;

// add the text field to the page
quatTreeLevelsContainer.appendChild(quatTreeLevelsEl);
// add the container to the settings container
settingsInnerContainer.appendChild(quatTreeLevelsContainer);

// create a container for the rotation input
const cornerTensionContainer = document.createElement("div");

// create a range input for the cornerTension
const cornerTensionEl = document.createElement("sl-range");
cornerTensionEl.id = "cornerTension";
cornerTensionEl.label = "Corner Tension (0-10)";
cornerTensionEl.helpText = "The lower the number, the less complex the image."
cornerTensionEl.value = 1;
cornerTensionEl.min = 0;
cornerTensionEl.max = 10;
cornerTensionEl.step = 0.1;

// add the text field to the page
cornerTensionContainer.appendChild(cornerTensionEl);
// add the container to the settings container
settingsInnerContainer.appendChild(cornerTensionContainer);


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


// Get the current URL query parameters
let params = new URLSearchParams(window.location.search);

// When the input value changes, update the URL query parameters
numPointsEl.addEventListener('input', function() {
  params.set('numPoints', this.value);
  window.history.replaceState({}, '', '?' + params.toString());
});

// When the input value changes, update the URL query parameters
quatTreeLevelsEl.addEventListener('input', function() {
  params.set('quatTreeLevels', this.value);
  window.history.replaceState({}, '', '?' + params.toString());
});

// When the corner tension value changes, update the URL query parameters
cornerTensionEl.addEventListener('input', function() {
  params.set('cornerTension', this.value);
  window.history.replaceState({}, '', '?' + params.toString());
});

// Check for close shape toggle
closeShapeToggle.addEventListener('sl-change', function() {
  params.set('closeShape', this.checked);
  window.history.replaceState({}, '', '?' + params.toString());
});

// Check for debug toggle
debugEl.addEventListener('sl-change', function() {
  params.set('debug', this.checked);
  window.history.replaceState({}, '', '?' + params.toString());
});

// When the page loads, check if there are query parameters for the input
window.addEventListener('load', function() {
  if (params.has('numPoints')) {
    numPointsEl.value = params.get('numPoints');
  }

  if (params.has('quatTreeLevels')) {
    quatTreeLevelsEl.value = params.get('quatTreeLevels');
  }

  if (params.has('cornerTension')) {
    cornerTensionEl.value = params.get('cornerTension');
  }

  if (params.has('closeShape')) {
    closeShapeToggle.checked = params.get('closeShape') == "true" ? true : false;
  }

  if (params.has('debug')) {
    debugEl.checked = params.get('debug') == "true" ? true : false;
  }
});
