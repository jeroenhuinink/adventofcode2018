import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const ids = data
    .toString()
    .split("\n")
    .filter(e => e != undefined);
  let twoCount =0;
  let threeCount = 0;
  ids.forEach(id => {
    const letters: { [key: string]: number} = {};
    for(let char of id) {
      if (!letters[char]) {
        letters[char] = 1;
      } else {
        letters[char] += 1;
      }
    }
    if (Object.values(letters).find(v => v == 2)) {
      twoCount++;
    }
    if (Object.values(letters).find(v => v == 3)) {
      threeCount++;
    }
  })
  const checksum = twoCount * threeCount;
  console.info(checksum);
});
