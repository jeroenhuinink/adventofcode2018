import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const lines = data
    .toString()
    .split("\n")
    

  console.info(lines);
});
