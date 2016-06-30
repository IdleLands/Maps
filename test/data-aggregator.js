const _ = require("lodash");
const fs = require("fs");
const requireDir = require("require-dir");

// load maps
const Map = require("./simple-map").SimpleMap;

const maps = {}

const walk = (dir) => {
  let results = []
  const list = fs.readdirSync(dir);

  list.forEach((baseFileName) => {
    file = dir + '/' + baseFileName
    stat = fs.statSync(file);
    if(stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push({map: (baseFileName.split(".")[0]), path: file});
  });

  return results;
};

_.each(walk(`${__dirname}/../world-maps`), (mapObj) => {
  maps[mapObj.map] = new Map(mapObj.path);
});

// load collectibles

const bosses = require("../content/boss.json");
const pets = require("../content/pets.json");

const collectibles = []
const requiredCollectibles = []
const collectibleObjs = []

_.each(maps, (mapData, mapName) => {
  const allCollectibleObjects = _.filter(mapData.map.layers[2].objects, (obj) => obj.type === "Collectible")
  _.each(allCollectibleObjects, (obj) => {
    obj.origin = `${mapName} (${obj.x/16},${obj.y/16})`;
    if(obj.properties) _.extend(obj, obj.properties);
  });

  collectibles.push(..._.map(allCollectibleObjects, 'name'));
  collectibleObjs.push(...allCollectibleObjects);
  requiredCollectibles.push(..._.map(
    _.filter(mapData.map.layers[2].objects, (obj) => _.get(obj, 'properties.requireCollectible')),
    (r) => r.properties.requireCollectible)
  );
});

_.each(bosses, (bossData, bossName) => {
  collectibles.push(..._.map(bossData.collectibles, 'name'));
  if(bossData.collectibles) {
    _.each(bossData.collectibles, (collectible) => collectible.origin = bossName);
    collectibleObjs.push(...bossData.collectibles);
  }
});

_.each(pets, (petData, petName) => {
  requiredCollectibles.push(...(petData.requirements.collectibles || []));
});

module.exports = {maps, collectibles, requiredCollectibles, collectibleObjs};
