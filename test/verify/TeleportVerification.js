console.log("travis_fold:start:verify_teleports");

const _ = require("lodash");

const teleports = require("../../content/teleports.json");

const locations = {}

_.each(teleports, (tpParent, i) => {
  _.each(tpParent, (tpData, teleport) => {
    if(locations[teleport]) throw new Error(`Duplicate teleport name (${teleport}); first instance: ${JSON.stringify(locations[teleport])}`);
    locations[teleport] = tpData;

    if(4 > _.size(tpData)) throw new Error(`Teleport (${teleport}) does not have enough properties. Expected 4, has ${_.size(tpData)}`);
  });
});

console.log("All teleports seem to be valid.");
console.log("travis_fold:end:verify_teleports");
