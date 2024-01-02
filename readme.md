# SVG Generator

This project is the starting point for creating algorithmic SVGs to be plotted on an 8 1/2 x 11 surface. Click the __Use this template__ button on GitHub to start.

From there, you can download your new project to your local machine, install the necessary file, and start the project.

```
npm install
npm run dev
```

## Where to write your code

Look for the `src` file in the `starter-svg.js` directory. This is where most of your code will be written. You can copy this to a new file or just write over the contents of the file itself. I've left in a bunch of other starter files I've created that might be of help to you, also. 

In the `main.js` file, you can change which file the project will reference. Look for the following import statement and update the filename if you've created a new Javascript file for your creation.

```
import { svgGenerator } from './starter-svg.js';
```

You will probably also want to update your project name using the `projectTitle` variable.

```
const projectTitle = "Starter SVG";
```

## References

[George Francis](https://github.com/georgedoescode) has published a wonderful [Generative Utilities set of functions](https://github.com/georgedoescode/generative-utils) that I use. I've [updated a couple of the functions](https://github.com/johnfmorton/generative-utils) I use in my projects. If you want to check out my updates, change the following line in the `package.json` file. (I've got a pull request in for these updates, but they may not align with what George wants to do with his repo.)

From:

```
"@georgedoescode/generative-utils": "^1.0.38",
```

To:

```
"@georgedoescode/generative-utils": "github:johnfmorton/generative-utils#johnfmorton-patch-for-points-in-path",
```

This project uses [SVG.js](https://svgjs.dev/docs/3.0/) to make the SVG creation easier. 

I hope you find it useful.

The settings panel uses [Shoelace web components](https://shoelace.style/).
