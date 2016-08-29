
console.log("travis_fold:start:verify_collectibles");

_ = require("lodash");

bosses = require("../../content/boss.json");

const dataAggregator = require("../data-aggregator");
const collectibles = dataAggregator.collectibles;
const requiredCollectibles = dataAggregator.requiredCollectibles;
const collectibleObjs = dataAggregator.collectibleObjs;

const countedCollectibles = _.countBy(collectibles);

_.each(countedCollectibles, (count, name) => {
   if(count > 1) throw new Error(`Collectible (${name}) already exists`);
});

_.each(requiredCollectibles, (req) => {
  if(!_.includes(collectibles, req)) throw new Error(`Collectible (${req}) is required but does not exist`);
});

_.each(collectibleObjs, (collectible) => {
  if(!collectible.flavorText) console.warn(`${collectible.name} [${collectible.origin}] has no flavorText.`);
  if(!collectible.storyline)  console.warn(`${collectible.name} [${collectible.origin}] has no storyline.`);
  if(collectible.rarity && !_.includes(['basic', 'pro', 'idle', 'godly'], collectible.rarity)) throw new Error(`Collectible ${collectible.name} has an invalid rarity.`);
});

console.log("All collectible data seems to be correct.");
console.log("travis_fold:end:verify_collectibles");
