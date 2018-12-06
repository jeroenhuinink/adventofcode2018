import * as fs from "fs";
import { X_OK } from "constants";

const ids = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  let maxX = 0;
  let maxY = 0;
  let id = -1;
  const coordinates = data
    .toString()
    .split("\n")
    .map(s => {
      const c = s.split(",").map(c => parseInt(c));
      if (c[0] > maxX) {
        maxX = c[0];
      }
      if (c[1] > maxY) {
        maxY = c[1];
      }
      c[2] = id;
      id++;
      return { name: ids[id], id, x: c[0], y: c[1], count: 1 };
    });

  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  };

  const grid: string[][] = [];
  for (let i = 0; i <= maxX; i++) {
    grid[i] = [];
    for (let j = 0; j <= maxY; j++) {
      grid[i][j] = "  ";
    }
  }

  coordinates.forEach(c => {
    grid[c.x][c.y] = ids.substr(c.id, 1) + "!";
  });

  const counts: number[] = [];
  for (let i = 0; i <= maxX; i++) {
    for (let j = 0; j <= maxY; j++) {
      if (!grid[i][j] || grid[i][j] == "  ") {
        grid[i][j] = ". ";
        const distances = coordinates.map((c, index) => ({
          name: ids.substr(c.id, 1),
          index,
          id: c.id,
          distance: distance(j, i, c.x, c.y)
        }));
        distances.sort((a, b) => a.distance - b.distance);
        if (distances[0].distance !== distances[1].distance) {
          grid[i][j] = ids[distances[0].id] + " ";
          
          if (coordinates[distances[0].index].count > 0) {
            coordinates[distances[0].index].count++;
          }
          if (i == 0 || i == maxY || j == 0 || j == maxX) {
            coordinates[distances[0].index].count = 0;
          }
        } 
      }
    }
  }
  
  console.info(
    coordinates.reduce(
      (accu, coord) => (coord.count > accu ? coord.count : accu),
      0
    )
  );
});
