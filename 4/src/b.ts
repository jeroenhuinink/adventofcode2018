import * as fs from "fs";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

  let guard = -1;
  let sleepLog: { start: number; stop: number }[][] = [];
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
      if (!sleepLog[guard] || sleepLog[guard].length === 0) {
        sleepLog[guard] = [];
      }
      if (observation == "falls asleep") {
        sleepLog[guard].push({ start: minute, stop: -1 });
      } else {
        if (observation == "wakes up") {
          sleepLog[guard][sleepLog[guard].length - 1].stop = minute;
        }
      }
    });

  const list = sleepLog
    .map((guardEntries, guardId) => {
      let sleepMinutes: number[] = [];
      guardEntries.forEach(entry => {
        for (let i = entry.start; i < entry.stop; i++) {
          if (!sleepMinutes[i]) {
            sleepMinutes[i] = 0;
          }
          sleepMinutes[i]++;
        }
      });
      let mostSleep = 0;
      let mostSleepMinute = -1;
      for (let i = 0; i < 60; i++) {
        if (sleepMinutes[i] > mostSleep) {
          mostSleep = sleepMinutes[i];
          mostSleepMinute = i;
        }
      }
      return { guardId, max: mostSleep, minute: mostSleepMinute };
    })
    .filter(s => !!s);

  const mostSleepGuard = list.reduce(
    (accu, current) => (accu.max < current.max ? current : accu),
    { max: 0, guardId: -1, minute: 0 }
  );
  console.info(mostSleepGuard.guardId * mostSleepGuard.minute);
});
