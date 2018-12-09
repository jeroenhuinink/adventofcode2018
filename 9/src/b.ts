import * as fs from "fs";
function solve(playerCount: number, marbleCount: number): number {
  const players: number[] = [];
  for (let i = 0; i < playerCount; i++) {
    players[i] = 0;
  }

  interface Circle {
    marble: number;
    next?: Circle;
    prev?: Circle;
  }

  let circle: Circle = { marble: 0 };
  circle.next = circle;
  circle.prev = circle;

  function printMarbles(c: Circle, first?: Circle): string {
    if (first && c == first) {
      return "";
    }
    if (!first) {
      first = c;
    }
    return (" " + c.marble).padStart(3, " ") + printMarbles(c.next, first);
  }

  let one: Circle = { marble: 1 };
  circle.next = one;
  circle.prev = one;
  one.next = circle;
  one.prev = circle;

  let i = 2;
  let currentMarble = one;
  while (i <= marbleCount) {
    if (i % 23 == 0) {
      players[i % playerCount] += i;
      const c = currentMarble.prev.prev.prev.prev.prev.prev.prev;
      players[i % playerCount] += c.marble;
      currentMarble = c.next;
      c.prev.next = c.next;
      c.next.prev = c.prev;
    } else {
      let n: Circle = { marble: i };
      n.prev = currentMarble.next;
      n.next = currentMarble.next.next;
      currentMarble.next.next.prev = n;
      currentMarble.next.next = n;
      currentMarble = n;
    }

    i++;
  }

  return players.reduce((max, v) => (v > max ? v : max), 0);
}

let testId = 0;
function test(data: string, expected: number) {
  testId++;
  const matches = data.match(/(\d+) players; last marble is worth (\d+)/);
  const playerCount = parseInt(matches[1]);
  const marbleCount = parseInt(matches[2]);
  const actual = solve(playerCount, marbleCount);
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

  const matches = data
    .toString()
    .match(/(\d+) players; last marble is worth (\d+)/);
  const playerCount = parseInt(matches[1]);
  const marbleCount = parseInt(matches[2]) * 100;
  console.info(solve(playerCount, marbleCount));
});
