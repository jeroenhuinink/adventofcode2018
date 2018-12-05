import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  //let polymer = "dabAcCaCBAcCcaDA"
  let polymer = data
    .toString()
    .split("")
    .map(s => s.charCodeAt(0));
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
  console.log(polymer.filter(d => !!d).length);
});
