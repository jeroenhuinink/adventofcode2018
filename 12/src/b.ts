import * as fs from "fs";

interface Pots {
  [key: number]: boolean;
}
interface Rule {
  match: string;
  result: string;
}

const potsToString = (pots: Pots) => {
  const keys = Object.keys(pots)
    .map(s => parseInt(s))
    .sort((a, b) => a - b);
  let first = false;
  return keys
    .map(key => {
      if (pots[key]) {
        first = true;
        return "#";
      } else if (first) {
        return ".";
      }
      return "";
    })
    .join("");
};

function match(current: Pots, index: number, match: string) {
  for (let i = 0; i < 5; i++) {
    const b1 = current[index - 2 + i] ? true : false;
    const b2 = match.substr(i, 1) == "#";
    if (b1 != b2) {
      return false;
    }
  }
  return true;
}

function generate(current: Pots, rules: Rule[]): Pots {
  const next: Pots = {};
  const { min, max } = Object.keys(current)
    .map(s => parseInt(s))
    .reduce(
      (a, v) =>
        v < a.min
          ? { min: v, max: a.max }
          : v > a.max
          ? { min: a.min, max: v }
          : a,
      { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
    );

  for (let i = min - 2; i < max + 2; i++) {
    if (i >= min && i < max) {
      next[i] = false;
    }
    for (let r of rules) {
      if (match(current, i, r.match)) {
        next[i] = r.result == "#";
        break;
      }
    }
  }

  return next;
}

function solve(
  initial: Pots,
  ruleLines: string[],
  generations: number
): number {
  const rules: Rule[] = ruleLines.map(l => {
    const match = l.substr(0, 5);
    const result = l.substr(9, 1);
    return { match, result };
  });

  let state = initial;
  let i = 0;
  for (i = 0; i < generations; i++) {
    const res = generate(state, rules);
    if (potsToString(state) == potsToString(res)) {
      break;
    }
    state = res;
  }

  return Object.keys(state)
    .map(s => parseInt(s))
    .reduce((a, key) => (state[key] ? a + key + (generations - i) : a), 0);
}

function test(
  input: string,
  rules: string[],
  generations: number,
  expected: number
) {
  const initialState: Pots = {};
  input.split("").forEach((v, i) => (initialState[i] = v == "#"));
  const actual = solve(initialState, rules, generations);
  if (actual != expected) {
    console.error(`Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

test(
  "#..#.#..##......###...###",
  `..... => .
....# => .
...#. => .
...## => #
..#.. => #
..#.# => .
..##. => .
..### => .
.#... => #
.#..# => .
.#.#. => #
.#.## => #
.##.. => #
.##.# => .
.###. => .
.#### => #
#.... => .
#...# => .
#..#. => .
#..## => .
#.#.. => .
#.#.# => #
#.##. => .
#.### => #
##... => .
##..# => .
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #
##### => .`.split("\n"),
  20,
  325
);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const lines = data.toString().split("\n");
  const rules = lines.slice(2);
  const state = lines[0].substring("initial state: ".length);
  
  test(state, rules, 20, 3494);

  const initialState: Pots = {};
  state.split("").forEach((v, i) => (initialState[i] = v == "#"));

  console.info(solve(initialState, rules, 50000000000));
});
