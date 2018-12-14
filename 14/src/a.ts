import * as fs from "fs";

let scoreboard: number[] = [];
let elves = [0, 1];

function createRecipe() {
  const score = elves.map(e => scoreboard[e]).reduce((a, v) => a + v, 0);
  const newReceipies = score
    .toString()
    .split("")
    .map(s => parseInt(s));
  newReceipies.forEach(r => scoreboard.push(r));
  elves = elves.map(e => (e + (scoreboard[e] + 1)) % scoreboard.length);
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

function solve(initial: string, count: number): string {
  scoreboard = initial
    .toString()
    .split("")
    .map(s => parseInt(s));
  elves = [0, 1];
  while (scoreboard.length < count + 10) {
    createRecipe();
    // logScoreboard();
  }
  return scoreboard
    .slice(count, count + 10)
    .join("");
}

function test(initial: string, count: number, expected:string) {
  const actual = solve(initial, count);
  if (actual != expected) {
    console.error(`Expected ${expected} got ${actual}`);
  }
}

test("37", 5, "0124515891");
test("37", 9, "5158916779");
test("37", 18, "9251071085");
test("37", 2018, "5941429882");

console.info(solve("37", 165061));
