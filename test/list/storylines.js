
console.log("travis_fold:start:list_collectible_storylines");

const _ = require('lodash');
const dataAggregator = require("../data-aggregator");
const collectibleObjs = dataAggregator.collectibleObjs;

console.log(`Storyline List`);

const counts = _.countBy(collectibleObjs, obj => {
  var storyline = obj.properties ? obj.properties.storyline : obj.storyline;
  return storyline;
});

_.each(_.sortBy(_.keys(counts)), (name) => {
  const count = counts[name];
  console.log(_.padEnd(name, 25), '\t|\t', count);
});

console.log("travis_fold:end:list_collectible_storylines");
