import * as fs from "fs";

interface Node {
  name: string;
  next: Node[];
  previous: Node[];
  available?: boolean;
  visited?: boolean;
}

function printNode(node: Node, level?: number) {
  const spacer = "                         ";
  console.log(`${spacer.substr(0, level)}${node.name}`);
  node.next.forEach(node => {
    printNode(node, (level || 0) + 1);
  });
}

function solve(data: string): string {
  const rules = data.split("\n").map(s => {
    const matches = s.match(/ (\w+) must be finished before step (\w+) /);
    return { to: matches[2], from: matches[1] };
  });

  const nodes: { [key: string]: Node } = {};
  rules.forEach(rule => {
    if (!nodes[rule.from]) {
      nodes[rule.from] = { name: rule.from, next: [], previous: [] };
    }
    if (!nodes[rule.to]) {
      nodes[rule.to] = { name: rule.to, next: [], previous: [] };
    }

    nodes[rule.from].next.push(nodes[rule.to]);
    nodes[rule.to].previous.push(nodes[rule.from]);
  });

  const nodeNames = Object.keys(nodes).sort();
  nodeNames.forEach(key => {
    const node = nodes[key];
    if (node.previous.length == 0) {
      node.available = true;
    }
  });
  let travels = [];
  while (travels.length < nodeNames.length) {
    const next = nodeNames.find(
      key => nodes[key].available && !nodes[key].visited
    );
    nodes[next].visited = true;
    nodes[next].next.forEach(node => {
      node.available = node.previous.every(node => node.visited);
    });
    travels.push(next);
  }
  return travels.join("");
}

let testId = 0;
function test(data: string, expected: string) {
  testId++;
  const actual = solve(data);
  if (actual != expected) {
    console.error(`Test ${testId} failed. Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

test(
  `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`,
  "CABDFE"
);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const license = data.toString();

  console.info(solve(license));
});
