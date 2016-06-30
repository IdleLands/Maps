
console.log("travis_fold:start:collectible_analysis");
console.log("Collectible Analysis");

const _ = require("lodash");

const collectibleObjs = require("../data-aggregator").collectibleObjs

const validCollectibles = _.sortBy(_.filter(collectibleObjs, (collectible) => collectible.flavorText), 'name');

const maxLeft = _.maxBy(validCollectibles, ((collectible) => collectible.name.length)).name.length;

_.each(validCollectibles, (collectible) => {
  story = collectible.storyline || "none";
  console.log(`${(_.padStart(collectible.name, maxLeft))}\t(${story}) ${collectible.flavorText}`);
});

console.log("travis_fold:end:collectible_analysis");
