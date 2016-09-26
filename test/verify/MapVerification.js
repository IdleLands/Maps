console.log("travis_fold:start:verify_maps");

const Map = require("../simple-map").Map;
const _ = require("lodash");
const fs = require("fs");

const bossparties = require("../../content/bossparties.json");
const bosses = require("../../content/boss.json");
const treasures = require("../../content/chests.json");
const teleports = require("../../content/teleports.json");
const teleLocs = _.extend({},
  teleports.towns,
  teleports.bosses,
  teleports.dungeons,
  teleports.trainers,
  teleports.other)

const maps = require("../data-aggregator").maps;

_.each(maps, (map, mapName) => {
  if(map.isCompressed) throw new Error(`Map layer compression should be turned off for ${mapName}!`);
  if(map.isNotCSV) throw new Error(`Map layer data should be CSV on ${mapName}!`);
});

inBounds = (x1, y1, x2, y2) => {
  if(x1 < 0 || y1 < 0) return false;
  if(x1 < x2 && y1 < y2) return true;
}

_.each(teleLocs, (teleData, teleName) => {
  const teleMap = maps[teleData.map];
  const tileData = teleMap.getTile(teleData.x, teleData.y);
  if(!inBounds(teleData.x, teleData.y, teleMap.width, teleMap.height)) throw new Error(`Teleport (${teleName}) not in map bounds`);
  if(tileData.blocked) throw new Error(`Teleport (${teleName}) lands on a dense tile`);
});

const allBossesOnMaps = [];
const allTreasureOnMaps = [];
const allTeleportsOnMaps = [];
_.each(maps, (mapData, mapName) => {
  allBossesOnMaps.push(
    ..._.map(
      _.filter(mapData.map.layers[2].objects, (obj) => _.includes(["Boss", "BossParty"], obj.type)
    ), 'name')
  );
  allTreasureOnMaps.push(
    ..._.map(
      _.filter(mapData.map.layers[2].objects, (obj) => obj.type === "Treasure"
    ), 'name')
  );

  const teleports = _.filter(mapData.map.layers[2].objects, (obj) => obj.type === "Teleport");
  _.each(teleports, (port) => {
    port.origin = mapName;
    _.extend(port, port.properties)
  });

  allTeleportsOnMaps.push(...teleports);

  _.each(mapData.map.layers[2].objects, obj => {
    if(obj.type) return;
    // console.log(`WARNING: Object @ ${obj.x/16},${obj.y/16} on ${mapName} has no type!`);
    if(obj.properties && obj.properties.movementType) {
      throw new Error('Object  @ ${obj.x/16},${obj.y/16} on ${mapName} does not have a type set, but appears to be a teleport.');
    }
  });
});

const allBossesInParties = [];
_.each(bossparties, (partyData, partyName) => {
  allBossesInParties.push(...partyData.members);

  if(!_.includes(allBossesOnMaps, partyName)) throw new Error(`BossParty (${partyName}) not on map`);
});

_.each(bosses, (bossData, bossName) => {
  if(_.includes(allBossesInParties, bossName)) return;
  if(!_.includes(allBossesOnMaps, bossName)) throw new Error(`Boss (${bossName}) not on map`);
});

_.each(treasures, (treasureData, treasureName) => {
  if(!_.includes(allTreasureOnMaps, treasureName)) throw new Error(`Treasure (${treasureName}) not on map`);
});

_.each(allTeleportsOnMaps, teleport => {

  let t = teleLocs[teleport.toLoc];
  let teleMap = null;
  let tileData = null;
  if(t) {
    teleport.map = t.map;
    teleport.destx = t.x;
    teleport.desty = t.y;
  }

  const teleName = `${teleport.name} - ${teleport.x/16},${teleport.y/16} (on ${teleport.origin})`;

  try {
    teleMap = maps[teleport.map];
    tileData = teleMap.getTile(+teleport.destx, +teleport.desty);
  } catch(e) {
    throw new Error(`Invalid teleport [${teleName}] leads to ${teleport.map} - ${teleport.destx},${teleport.desty} -- this map does not appear to exist.`);
  }

  if(!inBounds(teleport.destx, teleport.desty, teleMap.width, teleMap.height)) throw new Error(`Teleport [${teleName}] not in map bounds`);
  if(tileData.blocked) throw new Error(`Teleport [${teleName}] lands on a dense tile`);

  if(!_.includes(['teleport', 'ascend', 'descend', 'fall'], teleport.movementType)) throw new Error(`Teleport [${teleName}] does not have a valid teleport type (ascend, descend, fall, teleport)`);

  if(_.includes(['ascend', 'descend'], teleport.movementType) && _.get(tileData, 'object.type') !== 'Teleport') throw new Error(`Teleport [${teleName}] does not have a matching staircase`);

})

console.log("All map data seems to be correct.");
console.log("travis_fold:end:verify_maps");
