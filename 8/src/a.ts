import * as fs from "fs";

function solve(data: string) {  
  const components = data.split(" ").map(s => parseInt(s));
  let index: number = 0;
  let metadataTotal = 0;
  function parseTree() {
    const numberOfChildren = components[index];
    index++;
    const numberOfMetaData = components[index];
    index++;
    const children: any[] = [];
    for (let i = 0; i < numberOfChildren; i++) {
      children.push(parseTree());
    }
    const metadata: number[] = [];
    for (let i = 0; i < numberOfMetaData; i++) {
      metadataTotal += components[index];
      metadata.push(components[index]);
      index++;
    }
    return { children, metadata };
  }

  const tree = parseTree();
  console.info(tree);
  return metadataTotal;
}

let testId = 0;
function test(data: string, expected: number) {
  testId++;
  const actual = solve(data);
  if (actual != expected) {
    console.error(`Test ${testId} failed. Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

test("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2", 138);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const license = data.toString();

  console.info(solve(license));
});
