
console.log("travis_fold:start:list_requirements");

const _ = require('lodash');
const dataAggregator = require("../data-aggregator");
const maps = dataAggregator.maps;

console.log("Requirements");
_.each(maps, (mapData, mapName) => {
  _.each(mapData.map.layers[2].objects, (obj) => {
    const propKeys = _.keys(obj.properties || {});
    const reqKeys = _.filter(propKeys, key => _.includes(key, 'require'));

    _.each(reqKeys, req => {
      console.log(`Require "${req}": ${obj.properties[req]} @ ${obj.x/16}, ${obj.y/16}`);
    });
  });
});

console.log("travis_fold:end:list_requirements");
