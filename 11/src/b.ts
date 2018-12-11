function calculateGrid(
  serial: number
): { power: number; squarePower: number }[][] {
  const grid: { power: number; squarePower: number }[][] = [];
  for (let x = 1; x <= 300; x++) {
    for (let y = 1; y <= 300; y++) {
      const rackId = x + 10;
      let power = rackId * y;
      power += serial;
      power *= rackId;
      power = parseInt(power.toString().substr(-3, 1));
      power -= 5;
      if (!grid[y]) {
        grid[y] = [];
      }
      grid[y][x] = { power, squarePower: 0 };
    }
  }
  return grid;
}

let testId = 0;
function verifyGrid(serial: number, x: number, y: number, expected: number) {
  testId++;
  const grid = calculateGrid(serial);
  const actual = grid[y][x].power;
  if (actual != expected) {
    console.error(`${testId} failed. Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

verifyGrid(8, 3, 5, 4);
verifyGrid(57, 122, 79, -5);
verifyGrid(39, 217, 196, 0);
verifyGrid(71, 101, 153, 4);

function solveForSize(
  grid: { power: number; squarePower: number }[][],
  size: number
): { power: number; x: number; y: number } {
  let max = 0;
  let maxX = 0;
  let maxY = 0;

  for (let x = 1; x <= 300-size; x++) {
    for (let y = 1; y <= 300-size; y++) {
      for (let i = 0; i < size; i++) {
        grid[y][x].squarePower += grid[y + size - 1][x + i].power;
      }
      for (let i = 0; i < size; i++) {
        grid[y][x].squarePower += grid[y + i][x + size - 1].power;
      }
      grid[y][x].squarePower -= grid[y + size - 1][x + size - 1].power;
      if (grid[y][x].squarePower > max) {
        max = grid[y][x].squarePower;
        maxX = x;
        maxY = y;
      }
    }
  }

  return { power: max, x: maxX, y: maxY };
}

function solve(serial: number): { x: number; y: number; size: number } {
  const grid = calculateGrid(serial);

  let max = 0;
  let maxSize = 0;
  let maxPower = 0;
  let maxResult: { power: number; x: number; y: number } = null;
  for (let i = 1; i <= 300; i++) {
    console.log(i);
    const result = solveForSize(grid, i);
    if (result.power > maxPower) {
      maxPower = result.power;
      maxResult = result;
      maxSize = i;
    }
  }
  return { size: maxSize, x: maxResult.x, y: maxResult.y };
}

testId = 0;
function test(data: number, expected: { x: number; y: number }) {
  testId++;
  const grid = calculateGrid(data);
  const d1 = solveForSize(grid,1);
  const d2 =solveForSize(grid,2);
  const actual = solveForSize(grid, 3);
  if (actual.x != expected.x || actual.y != expected.y) {
    console.error(
      `${testId} failed. Expected ${expected.x}, ${expected.y} got ${
        actual.x
      }, ${actual.y}`
    );
    throw "test failed";
  }
}

test(18, { x: 33, y: 45 });
test(42, { x: 21, y: 61 });
test(9424, { x: 243, y: 72 });

console.info(solve(9424));
