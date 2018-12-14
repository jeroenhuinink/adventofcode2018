import * as fs from "fs";

type Direction = { dx: number; dy: number };

type Track = { rail: string; train: Train };

const north: Direction = { dx: 0, dy: -1 };
const south: Direction = { dx: 0, dy: 1 };
const east: Direction = { dx: 1, dy: 0 };
const west: Direction = { dx: -1, dy: 0 };

class Train {
  public direction: Direction;
  public x: number;
  public y: number;

  private static directions = [north, east, south, west];

  constructor(x: number, y: number, direction: string) {
    this.x = x;
    this.y = y;
    switch (direction) {
      case "^":
        this.direction = north;
        break;
      case "v":
        this.direction = south;
        break;
      case ">":
        this.direction = east;
        break;
      case "<":
        this.direction = west;
        break;
      default:
        throw `unknown direction: ${direction}`;
    }
  }

  public move(tracks: Track[][]): Train {
    tracks[this.y][this.x].train = null;

    this.x += this.direction.dx;
    this.y += this.direction.dy;

    const track = tracks[this.y][this.x].rail;

    if (track == "+") {
      this.goCrossing();
    } else if (track == "/" || track == "\\") {
      this.goCorner(track);
    } else if (
      track == " " ||
      this.y >= tracks.length ||
      this.x > tracks[0].length
    ) {
      throw `Train derailed at ${this.x}, ${this.y}`;
    }

    if (tracks[this.y][this.x].train) {
      return tracks[this.y][this.x].train;
    }

    tracks[this.y][this.x].train = this;
    return null;
  }

  private cross: number = 0;
  public goCrossing() {
    const i = Train.directions.indexOf(this.direction);
    switch (this.cross) {
      case 0:
        this.direction = Train.directions[(i + 3) % 4];
        break;
      case 2:
        this.direction = Train.directions[(i + 1) % 4];
        break;
      case 1:
        this.direction = Train.directions[i];
        break;
    }
    this.cross = (this.cross + 1) % 3;
  }

  public goCorner(corner: string) {
    const i = Train.directions.indexOf(this.direction);
    switch (corner) {
      case "/":
        switch (this.direction) {
          case south:
            this.direction = west;
            break;
          case north:
            this.direction = east;
            break;
          case east:
            this.direction = north;
            break;
          case west:
            this.direction = south;
            break;
          default:
            throw `unknown direction ${this.direction}`;
        }
        break;
      case "\\":
        switch (this.direction) {
          case south:
            this.direction = east;
            break;
          case north:
            this.direction = west;
            break;
          case east:
            this.direction = south;
            break;
          case west:
            this.direction = north;
            break;
          default:
            throw `unknown direction ${this.direction}`;
        }
        break;
      default:
        throw `unknown corner ${corner}`;
    }
  }
}

function parseInput(input: string): { trains: Train[]; tracks: Track[][] } {
  const trains: Train[] = [];
  const tracks: Track[][] = [];

  input.split("\n").forEach((line, y) => {
    tracks[y] = [];
    line.split("").forEach((character, x) => {
      let rail = "";
      let train = null;
      switch (character) {
        case "^":
          rail = "|";
          train = new Train(x, y, character);
          trains.push(train);
          break;
        case "v":
          rail = "|";
          train = new Train(x, y, character);
          trains.push(train);
          break;
        case ">":
          rail = "-";
          train = new Train(x, y, character);
          trains.push(train);
          break;
        case "<":
          rail = "-";
          train = new Train(x, y, character);
          trains.push(train);
          break;
        case "-":
        case "|":
        case "/":
        case "\\":
        case "+":
        case " ":
          rail = character;
          break;
        default:
          throw `unknown character: ${character}`;
      }
      tracks[y][x] = { rail, train };
    });
  });
  return { trains, tracks };
}

function logTracks(tracks: Track[][], trains: Train[]) {
  const v: string[][] = [];
  for (let i = 0; i < tracks.length; i++) {
    v[i] = [];
    for (let j = 0; j < tracks[i].length; j++) {
      const { rail, train } = tracks[i][j];
      v[i][j] = train
        ? train.direction == north
          ? "^"
          : train.direction == south
          ? "v"
          : train.direction == east
          ? ">"
          : train.direction == west
          ? "<"
          : "?"
        : rail;
    }
  }
  v.forEach((r, i) => console.info(i.toString().padStart(5, " "), r.join("")));
}

const initial = `/->-\\        
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `;

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  const { trains, tracks } = parseInput(data.toString());

  //logTracks(tracks, trains);

  function tick(): Train {
    const order = trains.sort((a, b) => a.x - b.x || a.y - b.y);
    for (let i = 0; i < order.length; i++) {
      const train = order[i];
      const conflict = train.move(tracks);
      if (conflict) {
        return conflict;
      }
    }
    return null;
  }

  let i = 0;
  let collision: Train = null;
  while (!collision) {
    collision = tick();
    i++;
  }

  if (collision) {
    console.info(collision.x, collision.y);
  }
});
