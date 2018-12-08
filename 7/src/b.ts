import * as fs from "fs";

interface Node {
  name: string;
  next: Node[];
  previous: Node[];
  available?: boolean;
  visited?: boolean;
  duration: number;
  working?: boolean;
}

function printNode(node: Node, level?: number) {
  const spacer = "                         ";
  console.log(
    `${spacer.substr(0, level || 0)}${node.name}-${node.duration}${
      node.visited ? "*" : " "
    }${node.available ? "!" : " "}`
  );
  node.next.forEach(node => {
    printNode(node, (level || 0) + 1);
  });
}

function solve(data: string, workers: number, offset: number): number {
  const rules = data.split("\n").map(s => {
    const matches = s.match(/ (\w+) must be finished before step (\w+) /);
    return { to: matches[2], from: matches[1] };
  });

  const nodes: { [key: string]: Node } = {};
  rules.forEach(rule => {
    if (!nodes[rule.from]) {
      nodes[rule.from] = {
        name: rule.from,
        duration: rule.from.charCodeAt(0) - 65 + offset,
        next: [],
        previous: []
      };
    }
    if (!nodes[rule.to]) {
      nodes[rule.to] = {
        name: rule.to,
        duration: rule.to.charCodeAt(0) - 65 + offset,
        next: [],
        previous: []
      };
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
  let work: { remaining: number; node: string }[] = [];
  for (let i = 0; i < workers; i++) {
    work[i] = { remaining: 0, node: "." };
  }

  let time = 0;
  while (time == 0 || work.some(w => w.node != ".")) {
    for (let i = 0; i < workers; i++) {
      const w = work[i];

      if (w.remaining == 0) {
        if (w.node != ".") {
          nodes[w.node].visited = true;
          nodes[w.node].next.forEach(node => {
            node.available = node.previous.every(node => node.visited);
          });
          travels.push(w.node);
          w.node = ".";
        }
      } else {
        w.remaining--;
      }
    }
    for (let i = 0; i < workers; i++) {
      const w = work[i];
      if (w.node == ".") {
        const next = nodeNames.find(
          key =>
            nodes[key].available && !nodes[key].visited && !nodes[key].working
        );
        if (next) {
          w.node = next;
          w.remaining = nodes[next].duration;
          nodes[next].working = true;
        }
      }
    }
    // console.log(
    //   `${time}\t${work.map(w => `${w.node}:${w.remaining}\t`)}\t${travels.join(
    //     ""
    //   )}`
    // );
    time++;
  }
  
  return time - 1;
}

let testId = 0;
function test(data: string, workers: number, offset: number, expected: number) {
  testId++;
  const actual = solve(data, workers, offset);
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
  1,
  0,
  21
);

test(
  `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`,
  2,
  0,
  15
);

test(
  `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`,
  2,
  5,
  38
);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const steps = data.toString();

  console.info(solve(steps, 5, 60));
});
