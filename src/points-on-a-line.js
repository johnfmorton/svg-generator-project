import {
    createNoiseGrid,
    createVoronoiTessellation,
    random,
    randomBias,
    map,
    spline,
    pointsInPath,
    seedPRNG,
} from '@georgedoescode/generative-utils'

import { mySettings } from './settingsManager.js'
const settings = _settingsInit()

// export the svgGenerator function
export function svgGenerator(svgObj) {
  // clear the existing svg of any elements
  svgObj.clear()

  // get the width and height of the svg canvas
  const { width, height } = svgObj.viewbox()

  const debug = settings.debug ?? false

  // If the resetSeed toggle is checked (true), or if there is no seed value assigned
  if (settings.resetSeed || !settings.seedValue) {
    // create a new random seed number
    let myseed = Math.floor(Math.random() * 100000)
    // assign the seed value to the settings object`
    settings.seedValue = myseed
    // set the seed for the PRNG
    seedPRNG(myseed)
  } else if (settings.seedValue) {
    // set the seed for the PRNG
    seedPRNG(settings.seedValue)
  }

  // This is where the custom code begins

  // find the center of the canvas
  const centerX = width / 2
  const centerY = height / 2
  const radius = height / 2

  // Get the number of points to draw from the settings object or use the default value of 500
  let numPoints = settings.numPoints ?? 500

  // An array to hold the points
  let points = []
  // loop through the number of points we want to draw
  for (let i = 0; i < numPoints; i++) {
    // get a random angle between 0 and 2PI
    const angle = random(0, Math.PI * 2)
    // get a random radius between 0 and the radius of the circle
    const r = random(0, radius)
    // get the x and y coordinates of the point
    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)

    // add the point to the points array
    points.push({ x, y })
  }

  // draw the points
  points.forEach((point) => {
    svgObj.circle(6).center(point.x, point.y).fill('#0d0')
  })

  // draw the a line from the center of the canvas to each point
  // points.forEach((point) => {
  //   svgObj.line(centerX, centerY, point.x, point.y).stroke({ width: 1 }).stroke({ color: "#0e0" });
  // });

  // draw a line from each point to every other point
  // points.forEach((point) => {
  //   points.forEach((point2) => {
  //     svgObj.line(point.x, point.y, point2.x, point2.y).stroke({ width: 1 }).stroke({ color: "#0e0" });
  //   });
  // });

  // find the outermost points by cycling through the points and finding the min and max x and y values
  let minX = width
  let maxX = 0
  let minY = height
  let maxY = 0
  points.forEach((point) => {
    if (point.x < minX) minX = point.x
    if (point.x > maxX) maxX = point.x
    if (point.y < minY) minY = point.y
    if (point.y > maxY) maxY = point.y
  })

  // create an array to hold the outer points
  let outerPoints = []

  // loop through the points and find the points that are on the outer edge of the canvas
  points.forEach((point) => {
    if (
      point.x === minX ||
      point.x === maxX ||
      point.y === minY ||
      point.y === maxY
    ) {
      outerPoints.push(point)
    }
  })

  // draw a line from each outer point to every other outer point
  // outerPoints.forEach((point) => {
  //   outerPoints.forEach((point2) => {
  //     svgObj.line(point.x, point.y, point2.x, point2.y).stroke({ width: 1 }).stroke({ color: "#0e0" });
  //   });
  // });

  // using spline, create a path from the outer points
  let pathString = spline(outerPoints, true)

  const pathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  )
  pathElement.setAttribute('d', pathString)

  // draw the path
  // let svgPath = svgObj.path(path).fill("none").stroke({ width: 1 }).stroke({ color: "#0e0" });

  // get the points in the path; returns array of objects with x and y properties
  let pointsInPaths = pointsInPath(pathElement, 50)

  // draw the points in the path
  pointsInPaths.forEach((point) => {
    svgObj.circle(6).center(point.x, point.y).fill('#00f')
  })

  // draw a line from the first point to the next point to the next point and so on
  pointsInPaths.forEach((point, index) => {
    if (index < pointsInPaths.length - 1) {
      svgObj
        .line(
          point.x,
          point.y,
          pointsInPaths[index + 1].x,
          pointsInPaths[index + 1].y
        )
        .stroke({ width: 1 })
        .stroke({ color: '#0e0' })
    }
  })

  // draw a line from the first point to the next point to the next point and so on with a BEZIER curve

  pointsInPaths.forEach((point, index) => {
    if (index < pointsInPaths.length - 1) {
      svgObj
        .line(
          point.x,
          point.y,
          pointsInPaths[index + 1].x,
          pointsInPaths[index + 1].y
        )
        .stroke({ width: 1 })
        .stroke({ color: "#F0E" });
    }
  }
  );


let d = `M ${pointsInPaths[0].x},${pointsInPaths[0].y}` // Move to the first point

pointsInPaths.forEach((point, index) => {
    if (index < pointsInPaths.length - 1) {
      // Calculate control points (cp1x, cp1y, cp2x, cp2y) here
      let cp1x = point.x
      let cp1y = point.y
      let cp2x = pointsInPaths[index + 1].x
      let cp2y = pointsInPaths[index + 1].y

      // Add the curve to the path
      d += ` C ${cp1x},${cp1y},${cp2x},${cp2y},${
        pointsInPaths[index + 1].x
        },${pointsInPaths[index + 1].y}`



        // // For simplicity, let's assume they are the midpoints between the current and next point
        // let midX = (point.x + pointsInPaths[index + 1].x) / 2
        // let midY = (point.y + pointsInPaths[index + 1].y) / 2

        // d += ` C ${midX},${midY},${midX},${midY},${
        //     pointsInPaths[index + 1].x
        // },${pointsInPaths[index + 1].y}`
    }
})

svgObj.path(d).fill('none').stroke({ width: 1, color: '#0FE' })



}



// helper function to initialize the settings manager
// use Shoelace Web Components to create the settings UI
// https://shoelace.style/
function _settingsInit() {
    // initialize the settings manager
    mySettings.init({ settingsElement: '#settings' })

    const numPoints = {
        sltype: 'sl-input',
        name: 'numPoints',
        options: {
            label: 'Number of points',
            type: 'number',
            min: 1,
            max: 1000,
            value: 50,
            step: 1,
            size: 'medium',
            helpText: 'The number of points used to draw the tessellation.',
        },
    }


    let divider = {
        sltype: 'sl-divider',
    }

    let resetSeedToggle = {
        sltype: 'sl-switch',
        name: 'resetSeed',
        options: {
            label: 'Reset Seed Each Time?',
            size: 'medium',
            helpText: 'Reset the seed on every generation',
            checked: true,
        },
    }

    let seed = {
        sltype: 'sl-input',
        name: 'seedValue',
        options: {
            label: 'Seed Value',
            type: 'text',
            value: 1234,
            step: 1,
            size: 'medium',
            helpText: 'The seed for the random number generator.',
        },
    }

    let myDebugOptions = {
        sltype: 'sl-switch',
        name: 'debug',
        options: {
            label: 'Debug',
            size: 'medium',
            helpText: 'Show debug info',
            checked: false,
        },
    }

    // add settings to the settings manager
    mySettings.add(
        numPoints,

        divider,
        resetSeedToggle,
        seed,
        divider,
        myDebugOptions
    )

    return mySettings
}
