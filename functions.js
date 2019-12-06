const computer = require('./computer');

module.exports = {
  day6_2: (json) => {
    const orbitMap = {};
    for (let orbit of json) {
      const [parent, child] = orbit.split(')');
      orbitMap[child] = parent;
    }
    const findTree = (target) => {
      const tree = [];
      let parent = orbitMap[target];
      while (parent) {
        tree.push(parent);
        parent = orbitMap[parent];
      }
      return tree;
    };
    const myTree = findTree('YOU');
    const santaTree = findTree('SAN');
    for (let i = 0; i < myTree.length; i++) {
      const santaHops = santaTree.indexOf(myTree[i]);
      if (santaHops > -1) {
        return santaHops + i;
      }
    }
  },
  day6_1: (json) => {
    const orbitMap = {};
    for (let orbit of json) {
      const [parent, child] = orbit.split(')');
      orbitMap[child] = parent;
    }
    const children = Object.keys(orbitMap);
    let totalOrbits = 0;
    for (let child of children) {
      let parent = orbitMap[child];
      while (parent) {
        totalOrbits++;
        parent = orbitMap[parent];
      }
    }
    return totalOrbits;
  },
  day5_2: (json) => {
    return computer.run(json, 5);
  },
  day5_1: (json) => {
    return computer.run(json, 1);
  },
  day4_2: (json) => {
    return module.exports.day4_1(json, true);
  },
  day4_1: (json, strict = false) => {
    const {min, max} = json;
    const check = (password) => {
      const str = `${password}`;
      const digits = str.split('');
      let lastDigit = 0;
      if (min <= +password && +password <= max && digits.length === 6) {
        const map = {};
        for (let digit of digits) {
          if (+digit < lastDigit) {
            return false;
          }
          map[+digit] = (map[+digit] || 0) + 1;
          lastDigit = +digit;
        }
        const counts = Object.values(map);
        if (strict) {
          return counts.some(c => c === 2);
        } else {
          return counts.some(c => c > 1);
        }
      }
      return false;
    };
    const passwords = [];
    for (let i = min; i <= max; i++) {
      if (check(+i)) {
        passwords.push(+i);
      }
    }
    return passwords.length;
  },
  day3_2: (json) => {
    return module.exports.day3_1(json, true);
  },
  day3_1: (json, byDelay = false) => {
    const [line1Segments, line2Segments] = json;
    let line1Coordinates = {x: 0, y: 0};
    let line2Coordinates = {x: 0, y: 0};
    let line1SignalDelay = 0;
    let line2SignalDelay = 0;
    const parseMove = move => {
      const direction = move.slice(0, 1);
      switch (direction) {
        case 'U':
          return {x: 0, y: +move.slice(1)};
        case 'D':
          return {x: 0, y: -+move.slice(1)};
        case 'L':
          return {x: -+move.slice(1), y: 0};
        case 'R':
          return {x: +move.slice(1), y: 0};
      }
    };
    const combineVectors = (start, move) => {
      start.x += move.x;
      start.y += move.y;
      return {...start};
    };
    const intersections = [];
    const drawLine = (coordinates, move) => ({
      start: {...coordinates},
      end: combineVectors(coordinates, move)
    });
    const getOvershot = (end, intersect) => Math.abs(Math.abs(end.x) - Math.abs(intersect.x)) + Math.abs(Math.abs(end.y) - Math.abs(intersect.y));
    for (let segment of line1Segments) {
      const move1 = parseMove(segment);
      const line1 = drawLine(line1Coordinates, move1);
      line2Coordinates = {x: 0, y: 0};
      line2SignalDelay = 0;
      line1SignalDelay += Math.abs(move1.x) + Math.abs(move1.y);
      for (let segment2 of line2Segments) {
        const move2 = parseMove(segment2);
        line2SignalDelay += Math.abs(move2.x) + Math.abs(move2.y);
        const line2 = drawLine(line2Coordinates, move2);
        const x1 = line1.start.x;
        const x2 = line1.end.x;
        const y1 = line1.start.y;
        const y2 = line1.end.y;
        const x3 = line2.start.x;
        const x4 = line2.end.x;
        const y3 = line2.start.y;
        const y4 = line2.end.y;
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
          continue;
        }
        const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        if (denominator === 0) {
          continue;
        }
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
          continue;
        }
        let x = x1 + ua * (x2 - x1);
        let y = y1 + ua * (y2 - y1);

        if (!(x === 0 && y === 0)) {
          const intersect = {x,y};
          intersect.delay = line1SignalDelay - getOvershot(line1.end, {x, y}) + line2SignalDelay - getOvershot(line2.end, {x, y})
          intersections.push(intersect);
        }
      }
    }
    if (byDelay) {
      intersections.sort((a, b) => (a.delay < b.delay) ? -1 : 1);
      return intersections[0].delay;
    } else {
      intersections.sort((a, b) => (Math.abs(a.x) + Math.abs(a.y)) < (Math.abs(b.x) + Math.abs(b.y)) ? -1 : 1);
      return Math.abs(intersections[0].x) + Math.abs(Math.abs(intersections[0].y));
    }
  },
  day2_2: (json, number) => {
    if (number === undefined) {
      number = 19690720;
    }
    let noun = -1;
    let verb = 0;
    let output = -1;
    while (output !== number) {
      const code = json.slice(0);
      noun++;
      if (noun > 99) {
        noun = 0;
        verb++;
      }
      code[1] = noun;
      code[2] = verb;
      output = computer.run(code)[0];
    }
    return {noun, verb};
  },
  day2_1: (json) => {
    return computer.run(json)[0];
  },
  day1_2: (json) => {
    const calculateFuel = fuel => {
      let fuelNeeded = Math.max(0, Math.floor(fuel / 3) - 2);
      if (fuelNeeded > 0) {
        fuelNeeded += calculateFuel(fuelNeeded);
      }
      return fuelNeeded;
    };
    const calculateFuels = (fuels) => {
      return fuels.map(fuel => {
        return calculateFuel(fuel);
      });
    };
    return calculateFuels(json).reduce((sum, input) => sum + input);
  },
  day1_1: (json) => {
    return json.reduce((sum, input) => sum + (Math.floor(input / 3) - 2), 0);
  }
};
