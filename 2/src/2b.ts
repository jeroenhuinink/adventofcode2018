import * as fs from "fs";

function hasOneDiff(a: string, b: string) {
  let diffCount = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diffCount === 1) {
        return false;
      }
      diffCount = 1;
    }
  }
  return true;
}

function shared(a: string, b: string) {
  let shared = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      shared = shared + a[i];
    }
  }
  return shared;
}

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const ids = data
    .toString()
    .split("\n")
    .filter(e => e != undefined);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (hasOneDiff(ids[i], ids[j])) {
        console.info(shared(ids[i], ids[j]));
        return;
      }
    }
  }
});
