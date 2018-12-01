import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.info(
    data
      .toString()
      .split("\n")
      .map(s => parseInt(s))
      .reduce((running: number, value: number) => running + value, 0)
  );
});
