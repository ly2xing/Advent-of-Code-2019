module.exports = {
  run: (code, input) => {
    const MODE = {
      POSITION: 0,
      IMMEDIATE: 1
    };
    let instructionPointer = 0;
    let halt = false;
    const output = [];
    const parseMode = (mode) => {
      if (mode === undefined) {
        mode = MODE.POSITION;
      }
      return +mode;
    };
    const parseInstruction = (instruction) => {
      const digits = instruction.toString().split('').reverse();
      return {
        opCode: [digits[1], digits[0]].join(''),
        mode1: parseMode(digits[2]),
        mode2: parseMode(digits[3]),
        mode3: parseMode(digits[4])
      }
    };
    const getValueByMode = (instructions, mode, value) => mode === MODE.POSITION ? +instructions[value] : value;
    const getLine = (instructions, pointer, lineSize) => instructions.slice(pointer, pointer + lineSize).map(i => +i);
    const knownInstructions = {
      '99': () => halt = true,
      '01': (instructions) => {
        const [opCode, noun, verb, result] = getLine(instructions, instructionPointer, 4);
        const parsed = parseInstruction(opCode);
        const value1 = getValueByMode(instructions, parsed.mode1, noun);
        const value2 = getValueByMode(instructions, parsed.mode2, verb);
        instructions[result] = value1 + value2;
        instructionPointer += 4;
      },
      '02': (instructions) => {
        const [opCode, noun, verb, result] = getLine(instructions, instructionPointer, 4);
        const parsed = parseInstruction(opCode);
        const value1 = getValueByMode(instructions, parsed.mode1, noun);
        const value2 = getValueByMode(instructions, parsed.mode2, verb);
        instructions[result] = value1 * value2;
        instructionPointer += 4;
      },
      '03': (instructions) => {
        const [opCode, noun] = getLine(instructions, instructionPointer, 2);
        instructions[noun] = input;
        instructionPointer += 2;
      },
      '04': (instructions) => {
        const [opCode, noun] = getLine(instructions, instructionPointer, 2);
        const parsed = parseInstruction(opCode);
        const input = getValueByMode(instructions, parsed.mode1, noun);
        output.push(input);
        instructionPointer += 2;
      },
      '05': (instructions) => {
        const [opCode, noun, verb] = getLine(instructions, instructionPointer, 3);
        const parsed = parseInstruction(opCode);
        if (getValueByMode(instructions, parsed.mode1, noun) !== 0) {
          instructionPointer = getValueByMode(instructions, parsed.mode2, verb);
        } else {
          instructionPointer += 3;
        }
      },
      '06': (instructions) => {
        const [opCode, noun, verb] = getLine(instructions, instructionPointer, 3);
        const parsed = parseInstruction(opCode);
        if (getValueByMode(instructions, parsed.mode1, noun) === 0) {
          instructionPointer = getValueByMode(instructions, parsed.mode2, verb);
        } else {
          instructionPointer += 3;
        }
      },
      '07': (instructions) => {
        const [opCode, noun, verb, end] = getLine(instructions, instructionPointer, 4);
        const parsed = parseInstruction(opCode);
        const value1 = getValueByMode(instructions, parsed.mode1, noun);
        const value2 = getValueByMode(instructions, parsed.mode2, verb);
        let result = 0;
        if (value1 < value2) {
          result = 1;
        }
        instructions[end] = result;
        instructionPointer += 4;
      },
      '08': (instructions) => {
        const [opCode, noun, verb, end] = getLine(instructions, instructionPointer, 4);
        const parsed = parseInstruction(opCode);
        const value1 = getValueByMode(instructions, parsed.mode1, noun);
        const value2 = getValueByMode(instructions, parsed.mode2, verb);
        let result = 0;
        if (value1 === value2) {
          result = 1;
        }
        instructions[end] = result;
        instructionPointer += 4;
      }
    };
    while (!halt) {
      const currentInstruction = code[instructionPointer];
      const operation = knownInstructions[currentInstruction.toString().slice(-2).padStart(2, '0')];
      if (operation) {
        operation(code);
      } else {
        console.error("Unexpected Token:", currentInstruction, " at index:", instructionPointer);
        halt = true;
      }
    }
    return output;
  }
};
