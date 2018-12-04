import * as fs from "fs";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  let guard = -1;
  let sleeptimes: { start: number; stop: number }[][] = [];
  const lines = data
    .toString()
    .split("\n")
    .filter(s => !!s)
    .sort()
    .map(s => {
      const matches = s.match(
        /^\[(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)\] (.*)$/
      );
      return {
        year: matches[1],
        month: matches[2],
        day: matches[3],
        hour: matches[4],
        minute: parseInt(matches[5]),
        observation: matches[6]
      };
    })
    .map(line => {
      const { observation } = line;
      const matches = observation.match(/^Guard #(\d+) begins shift/);
      if (matches) {
        guard = parseInt(matches[1]);
      }
      return { ...line, guard };
    })
    .forEach(line => {
      const { minute, guard, observation } = line;
      if (!sleeptimes[guard] || sleeptimes[guard].length === 0) {
        sleeptimes[guard] = [];
      }
      if (observation == "falls asleep") {
        sleeptimes[guard].push({ start: minute, stop: -1 });
      } else {
        if (observation == "wakes up") {
          sleeptimes[guard][sleeptimes[guard].length - 1].stop = minute;
        }
      }
    });
  const totaltimes = sleeptimes.map(guard =>
    guard.reduce((accu, current) => accu + (current.stop - current.start), 0)
  );
  const longest = totaltimes.reduce(
    (accu, current) => (accu < current ? current : accu),
    0
  );
  const guardId = totaltimes.indexOf(longest);
  let sleepMinutes:number[] = [];
  sleeptimes[guardId].forEach(line => {
    for (let i = line.start; i < line.stop; i++) {
      if (!sleepMinutes[i]) {
        sleepMinutes[i] = 0;
      }
      sleepMinutes[i]++;
    }
  });
  let mostSleepMinute = -1;
  let mostSleep = 0;
  for (let i =0; i<60;i++) {
    if (sleepMinutes[i] > mostSleep) {
      mostSleep = sleepMinutes[i];
      mostSleepMinute =i;
    }
  }
  console.info(guardId * mostSleepMinute);

});
