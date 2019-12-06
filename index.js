const functions = require('./functions');
const keys = Object.keys(functions).sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));
for (let key of keys.filter(k => k.startsWith(''))) {
  console.info('========================');
  console.info(`Executing ${key}`);
  const func = functions[key];
  const json = require(`./data/input${key.substring(3)}.json`);
  const startTime = process.hrtime();
  const result = func(json);
  const endTime = process.hrtime(startTime);
  console.info(`${key} completed, result:`, result);
  console.info('Execution time (hr): %ds %dms', endTime[0], endTime[1] / 1000000);
  console.info('========================');
}
