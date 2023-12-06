/*
 * A fork from George Francis' Generative SVG Starter Kit
 * https://codepen.io/georgedoescode/pen/abBQxBj
 * - Changed canvas to 8.5 x 11 document
 * - Added a download button to save the SVG you've created
 */

import './style.css'
import { SVG } from '@svgdotjs/svg.js';
import {
  createNoiseGrid,
  createVoronoiTessellation,
  random,
  randomBias,
  map,
  spline,
  pointsInPath
} from '@georgedoescode/generative-utils';

// The SVG element already present in the HTML
const svgGenerated = SVG("#svg-canvas");

// Used for the filename of the SVG generated that will be timestamped
// Don't include .svg extension in the name. Also, the filename will
// include a timestamp that starts with an underscore.
const projectTitle = "Stripes Example Project";

// set the #project-title in the HTML to the projectTitle variable
const projectNameEl = document.getElementById("project-title");
projectNameEl.innerHTML = projectTitle;

// regenerate button
const regenerateBtn = document.getElementById("regenerateBtn");

// download button
const downloadBtn = document.getElementById("downloadBtn");

// listen for clicks on the regenerate button
regenerateBtn.addEventListener("click", () => {
  // re-paint the stripes
  generate();
});

downloadBtn?.addEventListener("click", () => {
  downloadSvg();
});

// 200 x 154
const { width, height } = svgGenerated.viewbox();

const numStripes = 10;

function _getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);
  return year + month + day + "_" + hours + minutes + seconds;
}

function downloadSvg() {
  // Get the SVG data from the svg function in svg.js
  const svgData = svgGenerated.svg(); // This gets the SVG content

  // Creating a Blob object from the SVG data
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

  // Creating a URL for the Blob object
  const svgUrl = URL.createObjectURL(svgBlob);

  // Generating a timestamp
  const timestamp = _getTimestamp();

  // Creating a temporary anchor element to trigger download
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = _toValidFilename(projectTitle) + "_" + timestamp + ".svg"; // Name of the file to be downloaded
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// stripe width === viewBox width / the amount of stripes we would like to paint
const stripeWidth = width / numStripes;

// Do your thing inside the generate function! 🚀
function generate() {
  svgGenerated.clear();
  // store some simple browser default colors in an array
  const colors = ["red", "orange", "green", "blue", "pink", "yellow"];

  for (let i = 0; i < width; i += stripeWidth) {
    // pick a number between 0 and 5 (the length of the colors array)
    const diceRoll = Math.floor(Math.random() * colors.length);
    // pick out the color from the array using diceRoll as the index
    const color = colors[diceRoll];

    // draw a colored stripe on the canvas based on the dice roll
    svgGenerated.rect(stripeWidth, height).x(i).y(0).fill(color).stroke("#fff");
  }
}

generate();


function _toValidFilename(str) {
    // Replace invalid filename characters with an underscore
  let safeStr = str.replace(/[\\/:*?"<>|]/g, '_');

   // Replace spaces with underscores
    safeStr = safeStr.replace(/\s+/g, '_');

    // Trim leading and trailing spaces
    safeStr = safeStr.trim();

    // Convert to lowercase for case-insensitivity (optional)
    safeStr = safeStr.toLowerCase();

    return safeStr;
}


function updateTitle() {
  const projectNameEl = document.getElementById("project-title");
  // append the title element witht the projectTitle variable
  const titleElement = document.getElementsByTagName("title")[0];

  const currentTitle = titleElement.innerHTML;
  const newTitle = `${projectTitle} | ${currentTitle}`;
  titleElement.innerHTML = newTitle;
}

updateTitle();
