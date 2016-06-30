
console.log("travis_fold:start:verify_boss_treasure");

const _ = require("lodash");

const bosses = require("../../content/boss.json");
const bossitems = require("../../content/bossitems.json");
const treasure = require("../../content/treasure.json");

_.each(bosses, (bossData, boss) => {

  const verifyExistence = (key, warnOnEmpty = true, checkTreasure = true) => {

    if(_.isUndefined(bossData[key])) {
      if(warnOnEmpty) console.warn(`${boss} has no custom ${key}`);
      return;
    }

    for(let i = 0; i < bossData[key].length; i++) {
      const item = bossData[key][i];

      if(_.isUndefined(item.dropPercent)) throw new Error(`${item.name} does not have a dropPercent specified`);
      if(item.dropPercent <= 0 || item.dropPercent > 100) throw new Error(`${item.name} does not have a valid dropPercent (less than 0 or greater than 100)`);

      if(!checkTreasure) return;

      if(treasure[item.name])
        console.warn(`${item.name} is specified in treasure.json instead of bossitems.json`);

      else
        if(!bossitems[item.name]) throw new Error(`${item.name} is not in bossitems.json`);
      }
  }

  verifyExistence('items');
  verifyExistence('collectibles', false, false);
});

console.log("All boss treasures seem to be in order.");

console.log("travis_fold:end:verify_boss_treasure");
