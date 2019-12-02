module.exports = {
  day2_2: (number) => {
    if (number === undefined) {
      number = 19690720;
    }
    let noun = 0;
    let verb = 0;
    let code = JSON.parse(JSON.stringify(require('./input2_2.json')));
    code[1] = noun;
    code[2] = verb;
    let output = module.exports.day2_1(code);
    while (output !== number) {
      code = JSON.parse(JSON.stringify(require('./input2_2.json')));
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
  day2_1: (code) => {
    if (!code) {
      code = require('./input2_1.json');
    }
    let currentLine = 0;
    const getIndex = (lineNumber, instruction) => lineNumber * 4 + instruction;
    const readLine = (lineNumber) =>  [0, 1, 2, 3].map(ins => code[getIndex(lineNumber, ins)]);
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
    while(processLine(currentLine)) {
      currentLine++;
    }
    return code[0];
  },
  day1_2: () => {
    const json = require('./input1_2.json');
    const calculateFuel = fuel =>  Math.max(0, Math.floor(fuel / 3)-2);
    const calculateFuels = (fuels) => {
      return fuels.flatMap(fuel => {
        const list = [];
        let input = fuel;
        while (input > 0) {
          input = calculateFuel(input);
          list.push(input);
        }
        return list;
      });
    };
    return calculateFuels(json).reduce((sum, input) => sum + input);
  },
  day1_1: () => {
    const json = require('./input1_1.json');
    return json.reduce((sum, input) => {
      return sum + (Math.floor(input / 3)-2);
    }, 0);
  }
};
