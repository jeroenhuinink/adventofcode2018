import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  let solutions = [];
  for (let char = 65; char <= 65 + 26; char++) {
    let polymer = data
      .toString()
      .split("")
      .map(s => s.charCodeAt(0))
      .filter(s => s !== char && s !== char + 32);
    let i = 0;

    while (i < polymer.length) {
      if (Math.abs(polymer[i] - polymer[i + 1]) == 32) {
        polymer.splice(i, 2);
        if (i > 0) {
          i--;
        }
      } else {
        i++;
      }
    }
    solutions.push(polymer.filter(d => !!d).length);
  }
  console.info(solutions.reduce((a,b) => a < b ? a : b, Number.MAX_SAFE_INTEGER));
});
