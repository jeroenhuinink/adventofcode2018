import * as fs from "fs";

function parseInput(input: string) {
  const area = input.split("\n").map(s => s.split(""));
  return area;
}

function printArea(area: string[][]) {
  console.info(area.map((a,i) => a.join("")).join("\n"));
}

function countArea(area: string[][]) {
  let open = 0;
  let trees = 0;
  let lumberyard = 0;
  for (let i = 0; i < area.length; i++) {
    for (let j = 0; j < area[i].length; j++) {
      ({ trees, open, lumberyard } = checkAcre(area, i, j, {
        trees,
        open,
        lumberyard
      }));
    }
  }
  return { open, trees, lumberyard };
}
function checkAcre(
  area: string[][],
  i: number,
  j: number,
  counters: { trees: number; open: number; lumberyard: number }
) {
  const { trees, open, lumberyard } = counters;
  switch (area[i][j]) {
    case "|":
      return { trees: trees + 1, open, lumberyard };
    case ".":
      return { trees, open: open + 1, lumberyard };
    case "#":
      return { trees, open, lumberyard: lumberyard + 1 };
    default:
      throw `unknown character '${area[i][j]}'`;
  }
}

function countNeighbors(
  area: string[][],
  x: number,
  y: number
): { open: number; trees: number; lumberyard: number } {
  let open = 0;
  let trees = 0;
  let lumberyard = 0;
  const neighbors = [
    { x: x - 1, y: y - 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 }
  ];
  neighbors.forEach(({ x, y }) => {
    if (area[x] && area[x][y]) {
      ({ trees, open, lumberyard } = checkAcre(area, x, y, {
        trees,
        open,
        lumberyard
      }));
    }
  });
  return { open, trees, lumberyard };
}

function magic(previous: string[][]): string[][] {
  const current: string[][] = [];
  for (let i = 0; i < previous.length; i++) {
    if (!current[i]) {
      current[i] = [];
    }
    for (let j = 0; j < previous[i].length; j++) {
      const { open, trees, lumberyard } = countNeighbors(previous, i, j);
      if (previous[i][j] == ".") {
        if (trees >= 3) {
          current[i][j] = "|";
        } else {
          current[i][j] = ".";
        }
      } else if (previous[i][j] == "|") {
        if (lumberyard >= 3) {
          current[i][j] = "#";
        } else {
          current[i][j] = "|";
        }
      } else if (previous[i][j] == "#") {
        if (trees > 0 && lumberyard > 0) {
          current[i][j] = "#";
        } else {
          current[i][j] = ".";
        }
      } else {
        throw `unexpected character '${previous[i][j]}'`;
      }
    }
  }
  return current;
}

function solve(input: string): any {
  let area = parseInput(input);
  for (let minute = 0; minute < 10; minute++) {
    area = magic(area);
  }
  const{ trees, lumberyard } = countArea(area);
  return trees * lumberyard;
}

let testId = 0;
function test(input: string, expected: any) {
  testId++;
  const actual = solve(input);
  if (actual != expected) {
    console.error(`${testId} failed. Expected ${expected} got ${actual}`);
    throw "fail";
  }
}

test(
  `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.
`,
  1147
);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  console.info(solve(input));
});
