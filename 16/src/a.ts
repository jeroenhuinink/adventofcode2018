import * as fs from "fs";

function parseInstruction(id: number) {
  return id;
}

function process(
  instruction: number,
  lhs: number,
  rhs: number,
  output: number,
  registers: number[]
): number[] {
  const result = [...registers];
  function getRegister(id: number) {
    return result[id];
  }

  function setRegister(id: number, value: number) {
    result[id] = value;
  }
  
  switch (instruction) {
    case 0:
      //addr
      setRegister(output, getRegister(lhs) + getRegister(rhs));
      break;
    case 1:
      //addi
      setRegister(output, getRegister(lhs) + rhs);
      break;
    case 2:
      //mulr
      setRegister(output, getRegister(lhs) * getRegister(rhs));
      break;
    case 3:
      //muli
      setRegister(output, getRegister(lhs) * rhs);
      break;
    case 4:
      //banr
      setRegister(output, getRegister(lhs) & getRegister(rhs));
      break;
    case 5:
      //bani
      setRegister(output, getRegister(lhs) & rhs);
      break;
    case 6:
      //borr
      setRegister(output, getRegister(lhs) | getRegister(rhs));
      break;
    case 7:
      //bori
      setRegister(output, getRegister(lhs) | rhs);
      break;
    case 8:
      //setr
      setRegister(output, getRegister(lhs));
      break;
    case 9:
      //seti
      setRegister(output, lhs);
      break;
    case 10:
      //gtir
      setRegister(output, lhs > getRegister(rhs) ? 1 : 0);
      break;
    case 11:
      //gtri
      setRegister(output, getRegister(lhs) > rhs ? 1 : 0);
      break;
    case 12:
      //gtrr
      setRegister(output, getRegister(lhs) > getRegister(rhs) ? 1 : 0);
      break;
    case 13:
      //eqir
      setRegister(output, lhs === getRegister(rhs) ? 1 : 0);
      break;
    case 14:
      //eqri
      setRegister(output, getRegister(lhs) === rhs ? 1 : 0);
      break;
    case 15:
      //eqrr
      setRegister(output, getRegister(lhs) === getRegister(rhs) ? 1 : 0);
      break;
    default:
      throw `Unknown instruction: ${instruction}`;
  }
  return result;
}

function matches(
  before: number[],
  instruction: number[],
  expected: number[]
): number {
  let matches = 0;
  for (let i = 0; i < 16; i++) {
    const after = process(
      i,
      instruction[1],
      instruction[2],
      instruction[3],
      before
    );
    if (after.every((v, i) => expected[i] == v)) {
      matches++;
    }
    
  }
  return matches;
}

function solve(input: string): any {
  let solution = 0;
  const lines = input.split("\n");
  let i = 0;
  while (i < lines.length) {
    const before = lines[i]
      .substr(9, 10)
      .split(",")
      .map(s => parseInt(s));
    const instruction = lines[i + 1].split(" ").map(s => parseInt(s));
    const after = lines[i + 2]
      .substr(9, 10)
      .split(",")
      .map(s => parseInt(s));
    i += 4;
    const count = matches(before, instruction, after);
    if (count > 2) {
      solution++;
    }
  }
  return solution;
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
  `Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`,
  1
);

fs.readFile("input.a.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const input = data.toString();

  console.info(solve(input));
});
