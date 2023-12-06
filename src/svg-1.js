import {
  createNoiseGrid,
  createVoronoiTessellation,
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

  // find the center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // draw a circle at the center of the canvas

  // set the radius of the circle
  const radius = height / 2;
  // svgObj.circle(radius).center(centerX, centerY).fill("#fff").stroke("#f00");

  // loop through the number of points we want to draw
  const numPoints = 500;
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
  // draw the voronoi diagram
  // svgObj.path(voronoi.render()).fill("green").stroke("#f0f");


const debug = false;
tessellation.cells.forEach((cell) => {
    if (debug) {
      svgObj.polygon(cell.points).fill("none").stroke("#000");

      svgObj
        .circle(cell.innerCircleRadius * 2)
        .cx(cell.centroid.x)
        .cy(cell.centroid.y)
        .stroke("#0f0")
        .fill("none").scale(0.5);
      console.log(cell);

    } else {
      // svgObj
      //   .circle(cell.innerCircleRadius * 2)
      //   .cx(cell.centroid.x)
      //   .cy(cell.centroid.y)
      //   .fill(random(["#7257FA", "#FFD53D", "#1D1934", "#F25C54"]))
      //   // Reduce each circle's size a little, to give the pattern some room
      //   .scale(0.75);


      // svgObj.path('M ' + cell.centroid.x + ' ' + cell.centroid.x / 3 + ' L ' + cell.centroid.y + ' ' + cell.centroid.x + ' L ' + cell.centroid.x / 2 + ' ' + cell.centroid.y / 4 + ' z').fill("#fff").stroke("#000").scale(0.5);
      // cell.innerCircleRadius

      // based on the x and y coordinates and using the page width and height, figure out the rotation of the shape to make it face the center of the page

      const pageCenterX = width / 2;
      const pageCenterY = height / 2;

      const deltaX = pageCenterX - cell.centroid.x;
      const deltaY = pageCenterY - cell.centroid.y;

      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;



      svgObj.path('M 0 0 L ' + cell.innerCircleRadius + ' 0 L ' + cell.innerCircleRadius/2 + ' ' + cell.innerCircleRadius + ' z').fill("#fff").stroke("#000").x(cell.centroid.x - (cell.innerCircleRadius/2)).y(cell.centroid.y- (cell.innerCircleRadius/2.5)).rotate(angle+45);
    }
  });
}
