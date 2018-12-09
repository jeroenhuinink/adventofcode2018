import * as fs from "fs";
function solve(data: string): number {
  const matches = data.match(/(\d+) players; last marble is worth (\d+)/);
  const playerCount = parseInt(matches[1]);
  const marbleCount = parseInt(matches[2]);
  const players: number[] = [];
  for (let i = 0; i < playerCount; i++) {
    players[i] = 0;
  }

  let marbles: number[] = [0, 1];
  let i = 2;
  let currentMarble = 1;
  while (i <= marbleCount) {
    if (i % 23 == 0) {
      players[i % playerCount] += i;
      currentMarble = (currentMarble - 7 + marbles.length) % marbles.length;
      players[i % playerCount] += marbles[currentMarble];
      marbles.splice(currentMarble, 1);
    } else {
      currentMarble = (currentMarble + 2) % marbles.length;
      if (currentMarble == 0) {
        currentMarble = marbles.length;
      }
      marbles.splice(currentMarble, 0, i);
    }
    i++;
  }

  return players.reduce((max, v) => (v > max ? v : max), 0);
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
test("9 players; last marble is worth 25 points", 32);
test("10 players; last marble is worth 1618 points", 8317);
test("13 players; last marble is worth 7999 points", 146373);
test("17 players; last marble is worth 1104 points", 2764);
test("21 players; last marble is worth 6111 points", 54718);
test("30 players; last marble is worth 5807 points", 37305);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const line = data.toString();
  console.info(solve(line));
});
