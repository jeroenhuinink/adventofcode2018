import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const claims = data
    .toString()
    .split("\n")
    .map(s => {
      const matches = s.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/);
      return {
        id: parseInt(matches[1]),
        x: parseInt(matches[2]),
        y: parseInt(matches[3]),
        w: parseInt(matches[4]),
        h: parseInt(matches[5])
      };
    });

  let fabric: number[][] = [
  ];
  claims.forEach(claim => {
    for (let x = claim.x; x < claim.x + claim.w; x++) {
      for (let y = claim.y; y < claim.y + claim.h; y++) {
        if (!fabric[x]) {
          fabric[x] = [ 0 ];
        }
        if (!fabric[x][y]) {
          fabric[x][y] = 0;
        }
        fabric[x][y] += 1;
      }
    }
  });

  console.info(
    fabric
      .map(row => row.reduce((accu, current) => accu + (current && current > 1 ? 1 : 0)))
      .reduce((accu, current) => accu + current)
  );
});
