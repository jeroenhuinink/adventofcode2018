import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const changes = data
    .toString()
    .split("\n")
    .map(s => parseInt(s));

  let i = -1;
  function* getChanges() {
    i++;
    yield changes[i % changes.length];
  }

  const seen: boolean[] = [];
  let frequency = 0;
  for (;;) {
    for(let value of getChanges()) {
      if (seen[frequency]) {
        console.info(frequency);
        return;
      }
      seen[frequency] = true;
      frequency += value;
    }
  }
});
