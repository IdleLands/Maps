
console.log("travis_fold:start:list_collectibles");

const _ = require('lodash');
const dataAggregator = require("../data-aggregator");
const collectibleObjs = dataAggregator.collectibleObjs;

console.log(`Collectible List (${collectibleObjs.length})`);

_.each(_.sortBy(collectibleObjs, 'name'), obj => {
  var storyline = obj.properties ? obj.properties.storyline : obj.storyline;
  console.log(obj.name, '\t|\t', storyline, '\t|\t', obj.origin);
});

console.log("travis_fold:end:list_collectibles");
