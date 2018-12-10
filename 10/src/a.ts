import * as fs from "fs";
import { Duplex } from "stream";

function parse(data: string) {
  return data.split("\n").map(s => {
    const matches = s.match(
      /position=\<\s*([-+]?\d+),\s*([-+]?\d+)\s*\>\s*velocity=\<\s*([-+]?\d+),\s*([-+]?\d+)\s*\>\s*/
    );
    const x = parseInt(matches[1]);
    const y = parseInt(matches[2]);
    const dx = parseInt(matches[3]);
    const dy = parseInt(matches[4]);
    return { x, y, dx, dy };
  });
}

function display(data: string, time: number) {
  const points = parse(data);
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let maxY = 0;
  const image = points.map(p => {
    const x = p.x + time * p.dx;
    const y = p.y + time * p.dy;
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    return { x, y };
  });
  //console.log(minX, minY, maxX, maxY);
  if (maxY - minY > 10) {
    return false;
  }
  const grid: string[][] = [];
  for (let y = minY; y <= maxY; y++) {
    grid[y - minY] = [];
    for (let x = minX; x <= maxX; x++) {
      grid[y - minY][x - minX] = " ";
    }
  }

  image.forEach(p => {
    const { x, y } = p;
    grid[y - minY][x - minX] = "#";
  });

  for (let y = minY; y <= maxY; y++) {
    console.info(grid[y - minY].join(""));
  }
  return true;
}

display(
  `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`,
  3
);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const lines = data.toString();
  let i = 0;
  let found = false;
  while (!found) {
    found = display(lines, i);
    i++;
  }
  console.log(i - 1);
});
