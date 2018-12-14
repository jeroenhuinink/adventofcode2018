import * as fs from "fs";

let scoreboard: number[] = [];
let elves = [0, 1];

function createRecipe(length: number, last: string): string {
  const score = scoreboard[elves[0]] + scoreboard[elves[1]];
  if (score < 10) {
    scoreboard.push(score);
    last = (last + score.toString()).substr(-(length + 1));
  } else {
    scoreboard.push(1);
    scoreboard.push(score - 10);
    last = (last + "1" + (score - 10).toString()).substr(-(length + 1));
  }
  const e0 = elves[0];
  elves[0] = (e0 + (scoreboard[e0] + 1)) % scoreboard.length;
  const e1 = elves[1];
  elves[1] = (e1 + (scoreboard[e1] + 1)) % scoreboard.length;
  return last;
}

function logScoreboard() {
  console.log(elves);
  console.log(
    scoreboard
      .map((s, i) =>
        elves[0] == i
          ? "(" + s.toString() + ")"
          : elves[1] == i
          ? "[" + s.toString() + "]"
          : " " + s.toString() + " "
      )
      .join("")
  );
}

function solve(initial: string, match: string): number {
  scoreboard = initial
    .toString()
    .split("")
    .map(s => parseInt(s));
  elves = [0, 1];
  let i = 0;
  let last = initial;
  while (
    last.substr(0, match.length) !== match &&
    last.substr(1, match.length) !== match
  ) {
    i++;
    last = createRecipe(match.length, last);
  }
  if (last.substr(0, match.length) === match) {
    return scoreboard.length - match.length - 1;
  } else {
    return scoreboard.length - match.length;
  }
}

function test(initial: string, match: string, expected: number) {
  const actual = solve(initial, match);
  if (actual != expected) {
    console.error(`Expected ${expected} got ${actual}`);
    throw "fail";
  }
}

test("37", "012451", 5);
test("37", "51589", 9);
test("37", "92510", 18);
test("37", "59414", 2018);

console.info(solve("37", "165061"));
