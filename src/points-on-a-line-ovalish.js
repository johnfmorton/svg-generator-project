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
    let numPoints = settings.numPoints ?? 4

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

    const ovalPoints = _calculateCentersortPointsIntoOval(points, false)

    // draw the points
    if (debug) {
        ovalPoints.forEach((point) => {
            svgObj.circle(20).center(point.x, point.y).fill('#ccc')
        })
    }

    // draw from the first point in the ovalPoints array to the next point in the array back to the first point
    if (debug) {
        for (let i = 0; i < ovalPoints.length; i++) {
            // add text number to the point
            svgObj
                .text(`${i + 1}`)
                .font({ fill: '#f06' })
                .move(ovalPoints[i].x - 4.5, ovalPoints[i].y - 9.5)

            svgObj
                .line(
                    ovalPoints[i].x,
                    ovalPoints[i].y,
                    ovalPoints[i + 1].x,
                    ovalPoints[i + 1].y
                )
                .stroke({ width: 1 })
                .stroke({ color: '#0e0' })
        }
    }



    // using spline, create a path from the outer points
    let pathString = _spline8(points, 1.5, settings.closeLoop)

    // draw the path
    let splinePath = svgObj
        .path(pathString)
        .fill('rgba(0, 55, 255, 0.1)')
        .stroke({ width: 1 })
        .stroke({ color: '#333' })

    console.log(pathString)
    const pathElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    )
    pathElement.setAttribute('d', pathString)

    console.log(pathElement)

    // get the points in the path; returns array of objects with x and y properties
    let pointsInPaths = _pointsInPath(pathElement, settings.numberOfDivisions ?? 5)

    // // draw the points in the path
    pointsInPaths.forEach((point, index) => {
        // log the index of the point in the array
        console.log(index + 1)

        if (!debug) {
            svgObj.text(`${index + 1}`).center(point.x, point.y - 20)
            svgObj.circle(5).center(point.x, point.y).fill('#00f')
        }
    })
}



function _calculateCenter(points) {
    let sumX = 0,
        sumY = 0
    points.forEach((point) => {
        sumX += point.x
        sumY += point.y
    })
    return { x: sumX / points.length, y: sumY / points.length }
}

function _angleFromCenter(center, point) {
    return Math.atan2(point.y - center.y, point.x - center.x)
}

function _calculateCentersortPointsIntoOval(points, closeLoop = false) {
  const center = _calculateCenter(points)


    let updatedPoints = points.sort(
        (a, b) => _angleFromCenter(center, a) - _angleFromCenter(center, b)
    )



  return updatedPoints;
}


function _pointsInPath(path, numPoints = 10) {
    const pathLength = path.getTotalLength()
    const step = pathLength / (numPoints - 1) // Adjusted step to account for the end point
    const points = []

    for (let i = 0; i < numPoints - 1; i++) {
        points.push(path.getPointAtLength(i * step))
    }

    // Ensure the last point is the end of the path
    points.push(path.getPointAtLength(pathLength))

    return points
}



function _formatPoints(points, close) {
    points = [...points]

    if (!Array.isArray(points[0])) {
        points = points.map(({ x, y }) => [x, y])
    }

    if (close) {
        const lastPoint = points[points.length - 1]
        const secondToLastPoint = points[points.length - 2]

        const firstPoint = points[0]
        const secondPoint = points[1]

        points.unshift(lastPoint)
        points.unshift(secondToLastPoint)

        points.push(firstPoint)
        points.push(secondPoint)
    }

    return points.flat()
}

function _spline1(points = [], tension = 1, close = false, cb) {
    points = _formatPoints(points, close)

    const size = points.length
    const last = size - 4

    const startPointX = close ? points[2] : points[0]
    const startPointY = close ? points[3] : points[1]

    let path = 'M' + [startPointX, startPointY]

    cb && cb('MOVE', [startPointX, startPointY])

    const startIteration = close ? 2 : 0
    const maxIteration = close ? size - 4 : size - 2
    const inc = 2

    for (let i = startIteration; i < maxIteration; i += inc) {
        const x0 = i ? points[i - 2] : points[0]
        const y0 = i ? points[i - 1] : points[1]

        const x1 = points[i + 0]
        const y1 = points[i + 1]

        const x2 = points[i + 2]
        const y2 = points[i + 3]

        const x3 = i !== last ? points[i + 4] : x2
        const y3 = i !== last ? points[i + 5] : y2

        const cp1x = x1 + ((x2 - x0) / 6) * tension
        const cp1y = y1 + ((y2 - y0) / 6) * tension

        const cp2x = x2 - ((x3 - x1) / 6) * tension
        const cp2y = y2 - ((y3 - y1) / 6) * tension

        path += 'C' + [cp1x, cp1y, cp2x, cp2y, x2, y2]

        cb && cb('CURVE', [cp1x, cp1y, cp2x, cp2y, x2, y2])
    }

    return path
}


function _spline8(points = [], tension = 0.5, close = false, cb) {
    if (points.length < 2) return ''

    // Helper function to calculate a Catmull-Rom spline point
    function catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t
        const t3 = t2 * t

        return {
            x:
                0.5 *
                (2 * p1.x +
                    (-p0.x + p2.x) * t +
                    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
            y:
                0.5 *
                (2 * p1.y +
                    (-p0.y + p2.y) * t +
                    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        }
    }

    let path = 'M' + [points[0].x, points[0].y]
    cb && cb('MOVE', [points[0].x, points[0].y])

    const numPoints = points.length
    const segmentCount = 20 // Number of segments between control points
    const loopLimit = close ? numPoints : numPoints - 1

    for (let i = 0; i < loopLimit; i++) {
        const p0 = points[i === 0 ? (close ? numPoints - 1 : i) : i - 1]
        const p1 = points[i]
        const p2 = points[(i + 1) % numPoints]
        const p3 =
            points[
                i + 2 < numPoints ? i + 2 : close ? (i + 2) % numPoints : i + 1
            ]

        for (let j = 1; j <= segmentCount; j++) {
            const t = j / segmentCount
            const pt = catmullRom(p0, p1, p2, p3, t)

            path += 'L' + [pt.x, pt.y]
            cb && cb('LINE', [pt.x, pt.y])
        }
    }

    if (close) {
        path += 'Z'
    }

    return path
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
            value: 7,
            step: 1,
            size: 'medium',
            helpText: 'The number of points used to draw the tessellation.',
        },
    }

  const numberOfDivisions = {
    sltype: 'sl-input',
    name: 'numberOfDivisions',
    options: {
      label: 'Number of divisions',
      type: 'number',
      min: 5,
      max: 1000,
      value: 10,
      step: 1,
      size: 'medium',
      helpText: 'The number of points used to draw the tessellation.',
    },
  }

  const closeLoop = {
    sltype: 'sl-switch',
    name: 'closeLoop',
    options: {
      label: 'Close Loop',
      size: 'medium',
      helpText: 'Close the loop?',
      checked: false,
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
      numberOfDivisions,
closeLoop,
        divider,
        resetSeedToggle,
        seed,
        divider,
        myDebugOptions
    )

    return mySettings
}
