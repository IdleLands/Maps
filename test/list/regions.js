console.log("travis_fold:start:list_regions");

const _ = require('lodash');
const dataAggregator = require("../data-aggregator");
const maps = dataAggregator.maps;

const previousRegions = {};

console.log("Regions");
let total = 0;
_.each(maps, (mapData, mapName) => {
  _.each(mapData.map.layers[3] ? mapData.map.layers[3].objects : [], (obj) => {
    if(!obj.name || previousRegions[obj.name]) return;
    previousRegions[obj.name] = true;
    console.log(`Region "${obj.name}" in ${mapName} (#${++total})`);
  });
});

console.log("travis_fold:end:list_regions");
