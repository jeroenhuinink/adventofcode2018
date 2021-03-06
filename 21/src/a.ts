import * as fs from "fs";

function process(
  instruction: { opcode: string; lhs: number; rhs: number; output: number },
  ipRegister: number,
  registers: number[]
): { registers: number[]; ipRegister: number } {
  const { opcode, lhs, rhs, output } = instruction;
  const newRegisters = [...registers];
  function getRegister(id: number) {
    return newRegisters[id];
  }

  function setRegister(id: number, value: number) {
    newRegisters[id] = value;
  }

  switch (opcode) {
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
  return { registers: newRegisters, ipRegister };
}
function nextInstruction(ipRegister: number, ip: number, registers: number[]) {
  if (ipRegister > -1) {
    registers[ipRegister]++;
    return registers[ipRegister];
  } else {
    return ip + 1;
  }
}

function processProgram(input: string): any {
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
  let ipRegister = -1;
  let ip = 0;
  let registers = [0, 0, 0, 0, 0, 0];
  ipRegister = lines[0].lhs;
  const seen: number[] = [];
  while (ip < lines.length - 1) {
    if (ipRegister > -1) {
      registers[ipRegister] = ip;
    }
    count++;
    const before = `ip=${ip}, [${registers}] ${lines[ip + 1].opcode}(${
      lines[ip + 1].lhs
    }, ${lines[ip + 1].rhs}) => ${lines[ip + 1].output}`;
    if (ip == 28) {
      return registers[4];
    }
    const res = process(lines[ip + 1], ipRegister, registers);
    ipRegister = res.ipRegister;
    registers = res.registers;
    if (ipRegister > -1) {
      ip = registers[ipRegister];
    }

    ip++;
  }
}

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();

  console.info(processProgram(input));
});
