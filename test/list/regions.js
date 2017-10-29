console.log("travis_fold:start:list_regions");

const _ = require('lodash');
const dataAggregator = require("../data-aggregator");
const maps = dataAggregator.maps;

console.log("Regions");
let total = 0;
_.each(maps, (mapData, mapName) => {
  _.each(mapData.map.layers[3] ? mapData.map.layers[3].objects : [], (obj) => {
    console.log(`Region "${obj.name}" (#${++total})`);
  });
});

console.log("travis_fold:end:list_regions");
