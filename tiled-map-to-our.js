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

const background = tiledToCollision([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 469, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 469, 0, 469, 0, 0, 469, 469, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 469, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 0, 469, 469, 469, 469, 469, 469, 469, 469, 469, 469, 0, 0, 0, 0, 0, 0, 0, 0, 469, 0, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 469, 0, 469, 0, 0, 0, 0, 0, 0, 0, 0, 0], 20, 20);

console.log(JSON.stringify(background));
