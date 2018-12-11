export function calculateGrid(serial: number): number[][] {
  const grid: number[][] = [];
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
      grid[y][x] = power;
    }
  }
  return grid;
}

let testId = 0;
function verifyGrid(serial: number, x: number, y: number, expected: number) {
  testId++;
  const grid = calculateGrid(serial);
  const actual = grid[y][x];
  if (actual != expected) {
    console.error(`${testId} failed. Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

verifyGrid(8, 3, 5, 4);
verifyGrid(57, 122, 79, -5);
verifyGrid(39, 217, 196, 0);
verifyGrid(71, 101, 153, 4);

function solve(serial: number): { x: number; y: number } {
  let max = 0;
  let maxX = 0;
  let maxY = 0;
  const grid = calculateGrid(serial);
  for (let x = 1; x <= 300 - 2; x++) {
    for (let y = 1; y <= 300 - 2; y++) {
      const power =
        grid[y][x] +
        grid[y + 1][x] +
        grid[y + 2][x] +
        grid[y][x + 1] +
        grid[y + 1][x + 1] +
        grid[y + 2][x + 1] +
        grid[y][x + 2] +
        grid[y + 1][x + 2] +
        grid[y + 2][x + 2];
      if (power > max) {
        max = power;
        maxX = x;
        maxY = y;
      }
    }
  }
  return { x: maxX, y: maxY };
}
testId = 0;
function test(data: number, expected: { x: number; y: number }) {
  testId++;
  const actual = solve(data);
  if (actual.x != expected.x || actual.y != expected.y) {
    console.error(`${testId} failed. Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

test(18, {x:33, y:45});
test(42, {x:21, y:61});

console.info(solve(9424));