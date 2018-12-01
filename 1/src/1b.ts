
import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const changes = data
    .toString()
    .split("\n")
    .map(s => parseInt(s));
  const seen: boolean[] = [];
  let frequency = 0;
  let i = 0;
  for (;;) {
    if (seen[frequency]) {
      console.info(frequency);
      return;
    }
    seen[frequency] = true;
    frequency += changes[i];
    i++;
    if (i >= changes.length) {
      i = 0;
    }
  }
});
