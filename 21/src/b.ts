import * as fs from "fs";

function solve(input: string): any {
  return 0;
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

test("", 0);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  console.info(solve(input));
});
