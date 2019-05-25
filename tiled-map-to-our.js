const argv = require('yargs').argv;
const fs = require('fs');

if (!argv.input) {
  throw new Error('No input file specified');
}

if (!argv.output) {
  throw new Error('No output file specified');
}

const inputFile = `${__dirname}/${argv.input}`;
const outputFile = `${__dirname}/${argv.output}`;

fs.readFile(inputFile, (err, buf) => {
  if (err) {
    throw err;
  }

  const tiledData = JSON.parse(buf.toString());

  const newData = {
    height: tiledData.height,
    width: tiledData.width,
    layers: tiledData.layers.map(el => {
      let data;
      if (el.name === 'collision') {
        data = tiledToCollision(el.data, tiledData.width, tiledData.height);
      } else {
        data = tiledToOur(el.data, tiledData.width, tiledData.height);
      }
      return {
        data: data,
        name: el.name,
      };
    }),
  };

  const res = JSON.stringify(newData, (k, v) => {
    if (v instanceof Array && k !== 'layers')
      return JSON.stringify(v);
    return v;
  }, 2);

  fs.writeFile(outputFile, res, (err) => {
    if (err) {
      throw err;
    }

    console.log(`Successfully parsed. Results: file://${outputFile}`)
  });
});

console.log(inputFile);

function tiledToOur(data, width, height) {
  const copy = JSON.parse(JSON.stringify(data));

  const res = Array(height);
  for (let i = 0; i < height; i++) {
    res[i] = Array(width);
  }

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      res[i][j] = copy.shift() - 1;
    }
  }

  return res;
}

function tiledToCollision(data, width, height) {
  const copy = JSON.parse(JSON.stringify(data));

  const res = Array(height);
  for (let i = 0; i < height; i++) {
    res[i] = Array(width);
  }

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      res[i][j] = copy.shift() === 0 ? 0 : 1;
    }
  }

  return res;
}
