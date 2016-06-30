console.log("travis_fold:start:verify_treasure_chests");

const _ = require("lodash");

const treasure = require("../../content/treasure.json");
const chests = require("../../content/chests.json");

_.each(chests, (chestData, chest) => {
  if(_.get(chestData, 'items.length') === 0) throw new Error(`Chest (${chest}) has no items.`);

  for(let i = 0; i < chestData.items.length; i++) {
    const item = chestData.items[i];
    if(!treasure[item]) throw new Error(`Item (${item}) is not in treasure.json`);
  }
});

console.log("All chests seem to have vaild treasure.");
console.log("travis_fold:end:verify_treasure_chests");
