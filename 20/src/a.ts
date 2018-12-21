import * as fs from "fs";

type Direction = string | Directions;

interface Directions extends Array<Direction> {}

class Room {
  public index: number;
  public neighbors: Room[] = [];
  public x: number;
  public y: number;
  constructor(index: number, x: number, y: number) {
    this.index = index;
    this.neighbors = [];
    this.x = x;
    this.y = y;
  }
}

const infinity = Number.MAX_SAFE_INTEGER;

function longestPath(rooms: Room[], start: Room) {
  const visited: boolean[] = [];
  const distances: number[] = [];
  for (let i = 0; i < rooms.length; i++) {
    if (i == start.index) {
      distances[i] = 0;
    } else {
      distances[i] = infinity;
    }
  }

  function visit(current: Room) {
    current.neighbors
      .filter(n => !visited[n.index])
      .forEach(n => {
        if (distances[current.index] + 1 < distances[n.index]) {
          distances[n.index] = distances[current.index] + 1;
        }
      });

    visited[current.index] = true;
  }

  let unvisited = rooms.filter(r => !visited[r.index]);
  while (unvisited.find(f => distances[f.index] < infinity)) {
    const current = unvisited.sort(
      (a, b) => distances[a.index] - distances[b.index]
    )[0];

    if (current) {
      visit(current);
    }
    unvisited = rooms.filter(r => !visited[r.index]);
  }

  const max = distances.reduce((a, v) => (v > a ? v : a), 0);
  return max;
}

function parseDirections(input: string, index: number): Direction[] {
  let pos = 0;
  const peek = () => input.charAt(pos);
  const read = () => {
    pos++;
    return input.charAt(pos - 1);
  };

  const isDirection = () =>
    peek() == "E" || peek() == "S" || peek() == "W" || peek() == "N";
  const isOptionStart = () => peek() == "(";
  const isOptionDelimiter = () => peek() == "|";
  const isOptionEnd = () => peek() == ")";
  const eof = () => pos >= input.length;

  const readOptions = (): Direction[] => {
    let directions: Direction[] = [];
    read();
    while (!eof()) {
      directions.push(readNext());
      if (isOptionEnd()) {
        read();
        return directions;
      } else if (isOptionDelimiter()) {
        read();
      }
    }
    throw "unexpected eof";
  };

  const readDirection = (): Direction => {
    return read();
  };

  const readNext = (): Direction[] => {
    let directions: Direction[] = [];
    while (!eof()) {
      if (isDirection()) {
        directions.push(readDirection());
      } else if (isOptionStart()) {
        directions.push(readOptions());
      } else if (isOptionEnd() || isOptionDelimiter()) {
        return directions;
      } else {
        throw `unexpected token ${peek()}`;
      }
    }
    return directions;
  };
  return readNext();
}

function createRooms(directions: Direction[]): Room[] {
  let minX = infinity;
  let maxX = 0;
  let minY = infinity;
  let maxY = 0;
  const rooms: Room[] = [];

  const createRoom = (current: Room, dx: number, dy: number) => {
    const room = new Room(rooms.length, current.x + dx, current.y + dy);
    rooms.push(room);
    minX = Math.min(minX, current.x + dx);
    maxY = Math.max(maxX, current.x + dx);
    minY = Math.min(minY, current.y + dy);
    maxY = Math.max(maxY, current.y + dy);
    room.neighbors.push(current);
    current.neighbors.push(room);
    return room;
  };

  const openDoor = (current: Room, direction: string) => {
    const [dx, dy] =
      direction == "N"
        ? [0, -1]
        : direction == "S"
        ? [0, 1]
        : direction == "E"
        ? [1, 0]
        : [-1, 0];
    const neighbor = current.neighbors.filter(
      n => n.x == current.x + dx && n.y == current.y + dy
    )[0];

    if (neighbor) {
      return neighbor;
    } else {
      return createRoom(current, dx, dy);
    }
  };

  let current: Room = new Room(0, 0, 0);
  rooms.push(current);

  function parseDirections(current: Room, directions: Direction[], depth: number) {
    for (let i = 0; i < directions.length; i++) {
      if (Array.isArray(directions[i])) {
        parseDirections(current, directions[i] as Direction[], depth + 1);
      } else {
        current = openDoor(current, directions[i] as string);
      }
    }
  }
  parseDirections(current, directions, 0);
  return rooms;
}

function parseInput(input: string): Room[] {
  return createRooms(parseDirections(input.substr(1, input.length - 2), 0));
}

function solve(input: string): number {
  
  const rooms = parseInput(input);
  
  return longestPath(rooms, rooms[0]);
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

test("^WNE$", 3);
test("^ENWWW(NEEE|SSE(EE|N))$", 10);
test("^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$", 18);

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  console.info(solve(input));
});
