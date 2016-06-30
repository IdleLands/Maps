console.log("travis_fold:start:boss_analysis");
console.log("Boss Analysis");

const _ = require("lodash");

const bosses = require("../../content/boss.json");

const bossImportant = [];

_.each(bosses, (bossData, bossName) => {
  bossImportant.push({class: bossData.stats.class, level: bossData.stats.level});
});

const overallClass = _.countBy(bossImportant, 'class');

const perc = (min, max) => Math.floor(min/max*100);

console.log("\nBoss Class Breakdown (All)");
const classKeys = _.keys(overallClass);
_.each(_.sortBy(classKeys), (key) => {
  console.log(`${_.padStart(key, 15)}:\t${overallClass[key]}\t(${perc(overallClass[key], classKeys.length)}%)`);
});

console.log("\nBoss Level Range Breakdown (All)");

const RANGE_GRANULARITY = 5

const overallExist = _.countBy(bossImportant, (boss) => RANGE_GRANULARITY*(Math.floor(boss.level/RANGE_GRANULARITY)));
const levelKeys = _.keys(overallExist);

_.each(levelKeys, (key) => {
  level = parseInt(key);
  header = _.padStart(`Level ${level}-${level+RANGE_GRANULARITY-1}`, 15);
  console.log(`${header}:\t${overallExist[key]}\t(${perc(overallExist[key], levelKeys.length)}%)`);
});
console.log("travis_fold:end:boss_analysis");
