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
  for (let i = 0; ; i++) {
    const value = changes[i % changes.length];
    if (seen[frequency]) {
      console.info(frequency);
      return;
    }
    seen[frequency] = true;
    frequency += value;
  }
});
