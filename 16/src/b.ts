import * as fs from "fs";

let instructionList = [
  "addr",
  "addi",
  "mulr",
  "muli",
  "banr",
  "bani",
  "borr",
  "bori",
  "setr",
  "seti",
  "gtir",
  "gtri",
  "gtrr",
  "eqri",
  "eqir",
  "eqrr"
];

function process(
  instruction: string,
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
    case "addr":
      setRegister(output, getRegister(lhs) + getRegister(rhs));
      break;
    case "addi":
      setRegister(output, getRegister(lhs) + rhs);
      break;
    case "mulr":
      setRegister(output, getRegister(lhs) * getRegister(rhs));
      break;
    case "muli":
      setRegister(output, getRegister(lhs) * rhs);
      break;
    case "banr":
      setRegister(output, getRegister(lhs) & getRegister(rhs));
      break;
    case "bani":
      setRegister(output, getRegister(lhs) & rhs);
      break;
    case "borr":
      setRegister(output, getRegister(lhs) | getRegister(rhs));
      break;
    case "bori":
      setRegister(output, getRegister(lhs) | rhs);
      break;
    case "setr":
      setRegister(output, getRegister(lhs));
      break;
    case "seti":
      setRegister(output, lhs);
      break;
    case "gtir":
      setRegister(output, lhs > getRegister(rhs) ? 1 : 0);
      break;
    case "gtri":
      setRegister(output, getRegister(lhs) > rhs ? 1 : 0);
      break;
    case "gtrr":
      setRegister(output, getRegister(lhs) > getRegister(rhs) ? 1 : 0);
      break;
    case "eqir":
      setRegister(output, lhs === getRegister(rhs) ? 1 : 0);
      break;
    case "eqri":
      setRegister(output, getRegister(lhs) === rhs ? 1 : 0);
      break;
    case "eqrr":
      setRegister(output, getRegister(lhs) === getRegister(rhs) ? 1 : 0);
      break;
    default:
      throw `Unknown instruction: ${instruction}`;
  }
  return result;
}

const instructionMap: string[] = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

function matches(
  before: number[],
  instruction: number[],
  expected: number[]
): number {
  let found: { source: number; target: string }[] = [];

  for (let i = 0; i < instructionList.length; i++) {
    const after = process(
      instructionList[i],
      instruction[1],
      instruction[2],
      instruction[3],
      before
    );
    if (after.every((v, i) => expected[i] == v)) {
      found.push({ source: instruction[0], target: instructionList[i] });
    }
  }
  if (found.length == 1) {
    instructionMap[found[0].source] = found[0].target;
    instructionList = instructionList.filter(v => v != found[0].target);
  }

  return instructionList.length;
}

function findInstructionMap(input: string) {
  const lines = input.split("\n");

  let unresolved = 16;
  while (unresolved > 0) {
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
      if (!instructionMap[instruction[0]]) {
        unresolved = matches(before, instruction, after);
      }
    }
  }
}

let testId = 0;
function test(input: string, expected: any) {
  testId++;
  const actual = findInstructionMap(input);
  if (actual != expected) {
    console.error(`${testId} failed. Expected ${expected} got ${actual}`);
    throw "fail";
  }
}

// test(
//   `Before: [3, 2, 1, 1]
// 9 2 1 2
// After:  [3, 2, 2, 1]
// `,
//   1
// );

fs.readFile("input.a.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const input = data.toString();
  findInstructionMap(input);

  fs.readFile("input.b.txt", (err, data) => {
    if (err) {
      throw err;
    }
    const instructions = data
      .toString()
      .split("\n")
      .map(s => s.split(" ").map(i => parseInt(i)));
    
    let registers = [0, 0, 0, 0];
    instructions.forEach((instr,i) => {
      registers = process(instructionMap[instr[0]], instr[1], instr[2], instr[3], registers);
    });
    console.info(registers[0]);
  });
});
