console.log("travis_fold:start:verify_pets");

_ = require("lodash");

const pets = require("../../content/pets.json");
const bosses = require("../../content/boss.json");

_.each(pets, (petData, pet) => {
  if(!_.includes(['Hybrid', 'Non-Combat', 'Combat', 'Protector'], petData.category)) throw new Error(`Invalid pet type: ${petData.category} (${pet})`);
  if(_.size(petData.requirements) === 0) throw new Error(`No requirements specified (${pet})`);
  if(!petData.description) throw new Error(`No description specified (${pet})`);

  _.each(petData.requirements.bosses, (bossReq) => {
    if(!bosses[bossReq]) throw new Error(`Required boss kill for ${pet} (${bossReq}) does not exist.`);
  });

  _.each(petData.scale, (scaleArr, scaleVal) => {
    if(petData.scaleCost[scaleVal].length === scaleArr.length) return;
    throw new Error(`Incompatible array sizes for ${scaleVal} (${pet})`);
  });
});

console.log("All pets seem to be declared correctly.");
console.log("travis_fold:end:verify_pets");
