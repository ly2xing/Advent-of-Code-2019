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
    const { min, max } = json;
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
          map[+digit] = (map[+digit]||0) + 1;
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
    const [line1Moves, line2Moves] = json;
    const makeMove = (coordinates, move) => {
      const operator = move.substring(0, 1);
      const distance = move.substring(1);
      let points = new Array(+distance).fill(1);
      switch (operator) {
        case 'U':
          coordinates.y += +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.y -= (+distance - index - 1);
            coordinate.length += index + 1;
            return coordinate;
          });
          break;
        case 'R':
          coordinates.x += +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.x -= (+distance - index - 1);
            coordinate.length += index + 1;
            return coordinate;
          });
          break;
        case 'D':
          coordinates.y -= +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.y += +distance - index - 1;
            coordinate.length += index + 1;
            return coordinate;
          });
          break;
        case 'L':
          coordinates.x -= +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.x += +distance - index - 1;
            coordinate.length += index + 1;
            return coordinate;
          });
          break;
        default:
          console.error(`Unknown move, current coordinates:`, coordinates);
      }
      coordinates.length += +distance;
      return points;
    };
    const generateLine = (moves) => {
      const coordinates = {x: 0, y: 0, length: 0};
      let line = [];
      for (let move of moves) {
        const points = makeMove(coordinates, move);
        line = line.concat(points);
      }
      return line;
    };
    const comparator = (a, b) => (a.length < b.length) ? -1 : 1;
    const line1 = generateLine(line1Moves).sort(comparator);
    const line2 = generateLine(line2Moves).sort(comparator);
    const line1Strings = line1.map(l => `X${l.x}Y${l.y}`);
    const line2Strings = line2.map(l => `X${l.x}Y${l.y}`);
    const intersections = line1Strings.filter(value => line2Strings.includes(value));
    const yIndex = intersections[0].indexOf('Y');
    const x = +intersections[0].substring(1, yIndex);
    const y = +intersections[0].substring(yIndex + 1);
    const point1 = line1.find(p => p.x === x && p.y === y);
    const point2 = line2.find(p => p.x === x && p.y === y);
    return point1.length + point2.length;
  },
  day3_1: (json) => {
    const [line1Moves, line2Moves] = json;
    const makeMove = (coordinates, move) => {
      const operator = move.substring(0, 1);
      const distance = move.substring(1);
      coordinates.length += distance;
      let points = new Array(+distance).fill(1);
      switch (operator) {
        case 'U':
          coordinates.y += +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.y -= (+distance - index - 1);
            return coordinate;
          });
          break;
        case 'R':
          coordinates.x += +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.x -= (+distance - index - 1);
            return coordinate;
          });
          break;
        case 'D':
          coordinates.y -= +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.y += +distance - index - 1;
            return coordinate;
          });
          break;
        case 'L':
          coordinates.x -= +distance;
          points = points.map((val, index) => {
            const coordinate = {...coordinates};
            coordinate.x += +distance - index - 1;
            return coordinate;
          });
          break;
        default:
          console.error(`Unknown move, current coordinates:`, coordinates);
      }
      return points;
    };
    const generateLine = (moves) => {
      const coordinates = {x: 0, y: 0, length: 0};
      let line = [];
      for (let move of moves) {
        const points = makeMove(coordinates, move);
        line = line.concat(points);
      }
      return line;
    };
    const comparator = (a, b) => (Math.abs(a.x) + Math.abs(a.y)) < (Math.abs(b.x) + Math.abs(b.y)) ? -1 : 1;
    const line1 = generateLine(line1Moves).sort(comparator);
    const line2 = generateLine(line2Moves).sort(comparator);
    const line1Strings = line1.map(l => `X${l.x}Y${l.y}`);
    const line2Strings = line2.map(l => `X${l.x}Y${l.y}`);
    const intersections = line1Strings.filter(value => line2Strings.includes(value));
    const yIndex = intersections[0].indexOf('Y');
    const x = +intersections[0].substring(1, yIndex);
    const y = +intersections[0].substring(yIndex + 1);
    return Math.abs(x) + Math.abs(y);
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
      output = module.exports.day2_1(code);
    }
    return {noun, verb};
  },
  day2_1: (json) => {
    const code = json;
    let currentLine = 0;
    const getIndex = (lineNumber, instruction) => lineNumber * 4 + instruction;
    const readLine = (lineNumber) => [0, 1, 2, 3].map(ins => code[getIndex(lineNumber, ins)]);
    const processLine = (lineNumber) => {
      const line = readLine(lineNumber);
      const op1 = line[1];
      const op2 = line[2];
      const op3 = line[3];
      switch (line[0]) {
        case 99:
          return false;
        case 1:
          code[op3] = code[op1] + code[op2];
          return true;
        case 2:
          code[op3] = code[op1] * code[op2];
          return true;
        default:
          console.error("Unexpected Token:", line[0], "on line:", lineNumber, "index:", getIndex(lineNumber, 0));
          return false;
      }
    };
    while (processLine(currentLine)) {
      currentLine++;
    }
    return code[0];
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
