console.log("travis_fold:start:treasure_analysis");
console.log("Treasure Analysis");

const _ = require("lodash");

// TODO shim this like maps are shimmed
const Equipment = require("../../src/item/Equipment");

const bosses = require("../../config/boss.json");
const bossitems = require("../../config/bossitems.json");
const treasure = require("../../config/treasure.json");

const allTreasure = [];

const perc = (min, max) => Math.floor(min/max*100);

_.each(bosses, (bossData, bossName) => {
  _.each(bossData.items, (itemProto) => {
    const item = new Equipment(bossitems[itemProto.name]);
    allTreasure.push({source: "Boss", type: item.type, score: item.score()});
  });
});

_.each(treasure, (treasureData, treasureName) => {
  const item = new Equipment(treasureData)
  allTreasure.push({source: "Chest", type: item.type, score: item.score()});
});

const sortedBySlot    = _.countBy(allTreasure, 'type')
const sortedBySource  = _.countBy(allTreasure, 'source')
const countBySlotType = _.reduce((_.keys sortedBySlot), (prev, slot) => {
                      prev[slot] = _(allTreasure).filter((item) => item.type is slot).countBy('source').value();
                      return prev;
                    }
                  , {});

console.log("\nAll Treasure Sources");

_.each((_.keys sortedBySource), (source) => {
  const header = _.padStart(source, 10);
  console.log(`${header}:\t${sortedBySource[source]} (${perc(sortedBySource[source], allTreasure.length)}%)`);
});

console.log("\nTreasure Counts (Overall)");

_.each((_.keys sortedBySlot), (slot) => {
  const header = _.padStart(slot, 10);
  console.log(`${header}:\t${sortedBySlot[slot]}\t(${perc sortedBySlot[slot], allTreasure.length}%)`);
});

console.log("\nTreasure Acquisition By Slot");

_.each((_.keys sortedBySlot), (slot) => {

  const header = _.padStart(slot, 10);
  start = `${header}:`
  _.each (_.keys sortedBySource), (source) => {
      start = `${start}\t${source}: ${countBySlotType[slot][source] or 0} (${perc (countBySlotType[slot][source] or 0), sortedBySlot[slot]}%)`);
  });

  console.log(start);
});

console.log("travis_fold:end:treasure_analysis");
