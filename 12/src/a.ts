import * as fs from "fs";

let offset = 0;
function generate(
  state: string,
  rules: { match: string; result: string }[]
): string {
  let newState = "..";
  for (let i = 2; i < state.length - 1; i++) {
    const local = state.substr(i - 2, 5);

    for (let r of rules) {
      if (local == r.match) {
        newState += r.result;
      }
    }
  }
  return newState + "..";
}

function solve(initialState: string, ruleLines: string[]): number {
  const rules = ruleLines.map(l => {
    const match = l.substr(0, 5);
    const result = l.substr(9, 1);
    return { match, result };
  });
  let state =
    "........................................" +
    initialState +
    "........................................";
  for (let i = 0; i < 20; i++) {
    state = generate(state, rules);
  }
  return state.split("").reduce((a, v, i) => (v == "#" ? a + (i - 40) : a), 0);
}

function test(initialState: string, rules: string[], expected: number) {
  const actual = solve(initialState, rules);
  if (actual != expected) {
    console.error(`Expected ${expected} got ${actual}`);
    throw "test failed";
  }
}

test(
  "#..#.#..##......###...###",

  `
..... => .
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
  325
);
{
}
fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const lines = data.toString().split("\n");
  const initialState = lines[0].substring("initial state: ".length);
  const rules = lines.slice(2);
  console.info(solve(initialState, rules));
});
