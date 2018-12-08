import * as fs from "fs";

interface Tree {
  children: Tree[];
  metadata: number[];
}

function solve(data: string) {
  const components = data.split(" ").map(s => parseInt(s));

  let index: number = 0;
  function parseTree(): Tree {
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
      metadata.push(components[index]);
      index++;
    }
    return { children, metadata };
  }

  function calculateValue(tree: Tree): number {

    if (tree.children.length == 0) {
      return tree.metadata.reduce((a, v) => a + v, 0);
    } else {
      return tree.metadata
        .map(meta =>
          meta > 0 && meta <= tree.children.length
            ? calculateValue(tree.children[meta - 1])
            : 0
        )
        .reduce((a, v) => a + v, 0);
    }
  }
  const tree = parseTree();
  return calculateValue(tree);
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

test("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2", 66);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const license = data.toString();

  console.info(solve(license));
});
