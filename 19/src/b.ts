import * as fs from "fs";

const registerNames = ["A", "B", "C", "ip", "E", "F"];
function output(instruction: {
  opcode: string;
  lhs: number;
  rhs: number;
  output: number;
}): string {
  const { opcode, lhs, rhs, output } = instruction;

  switch (opcode) {
    case "bind":
      return `ip <= ${registerNames[lhs]}`;
    case "addr":
      return `${registerNames[output]} := ${registerNames[lhs]} + ${
        registerNames[rhs]
      }`;
    case "addi":
      return `${registerNames[output]} := ${registerNames[lhs]} + ${rhs}`;

    case "mulr":
      return `${registerNames[output]} := ${registerNames[lhs]} * ${
        registerNames[rhs]
      }`;

    case "muli":
      return `${registerNames[output]} := ${registerNames[lhs]} * ${rhs}`;

    case "banr":
      return `${registerNames[output]} := ${registerNames[lhs]} & ${
        registerNames[rhs]
      }`;

    case "bani":
      return `${registerNames[output]} := ${registerNames[lhs]} & ${rhs}`;

    case "borr":
      return `${registerNames[output]} := ${registerNames[lhs]} | ${
        registerNames[rhs]
      }`;

    case "bori":
      return `${registerNames[output]} := ${registerNames[lhs]} | ${rhs}`;

    case "setr":
      return `${registerNames[output]} := ${registerNames[lhs]}`;

    case "seti":
      return `${registerNames[output]} := ${lhs}`;

    case "gtir":
      return `${registerNames[output]} := ${lhs} > ${
        registerNames[rhs]
      } ? 1 : 0`;
    case "gtri":
      return `${registerNames[output]} := ${
        registerNames[lhs]
      } > ${rhs} ? 1 : 0`;

    case "gtrr":
      return `${registerNames[output]} := ${registerNames[lhs]} > ${
        registerNames[rhs]
      } ? 1 : 0`;

    case "eqir":
      return `${registerNames[output]} := ${lhs} === ${
        registerNames[rhs]
      } ? 1 : 0`;

    case "eqri":
      return `${registerNames[output]} := ${
        registerNames[lhs]
      } === ${rhs} ? 1 : 0`;

      break;
    case "eqrr":
      return `${registerNames[output]} := ${registerNames[lhs]} === ${
        registerNames[rhs]
      } ? 1 : 0`;

      break;
    default:
      throw `Unknown instruction: ${instruction}`;
  }
}

function solve(input: string): any {
  const lines = input
    .split("\n")
    .map(s => s.split(" "))
    .map(l =>
      l[0].substr(0, 3) == "#ip"
        ? { opcode: "bind", lhs: parseInt(l[1]), rhs: -1, output: -1 }
        : {
            opcode: l[0],
            lhs: parseInt(l[1]),
            rhs: parseInt(l[2]),
            output: parseInt(l[3])
          }
    );

  let count = 0;
  while (count < lines.length) {
    console.log(count - 1, output(lines[count]));
    count++;
  }
  return -1;
}

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  solve(input);

  let total = 0;
  for (let i = 1; i <= 10551378; i++) {
    if (10551378 % i == 0) {
      total += i;
    }
  }

  console.info(total);
});
