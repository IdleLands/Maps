console.log("travis_fold:start:pet_analysis");
console.log("Pet Analysis");

const _ = require("lodash");

const pets = require("../../content/pets.json");

const getPetCost = (petData) => {
  let ret = 0
  _.each(petData.scaleCost, (arr, attr) => {
    ret += _.reduce(arr, ((prev, cur) => prev+cur), 0);
  });
  return ret;
};

const getNumPetUpgrades = (petData) => {
  let ret = 0
  _.each(petData.scaleCost, (arr, attr) => {
    ret += arr.length;
  });
  return ret;
}

const xpCalc = (level) => Math.floor(100 + (400 * Math.pow(level, 1.71)));

const getPetInfo = (petData) => {
  const scale         = petData.scale
  const minXpPerLevel = scale.xpPerGold[0]
  const maxXpPerLevel = scale.xpPerGold[scale.xpPerGold.length-1]
  const maxLevel      = scale.maxLevel[scale.maxLevel.length-1]

  let xpNeeded = 0;
  for(let i = 1; i <= maxLevel; i++) {
    xpNeeded += xpCalc(i);
  }

  return {
    minXpCost: Math.floor(xpNeeded/minXpPerLevel),
    maxXpCost: Math.floor(xpNeeded/maxXpPerLevel),
    totalXpNeeded: xpNeeded,
    maxLevel: maxLevel
  }
};

const sortedPets = _.sortBy(_.keys(pets));
_.each(sortedPets, (pet) => {

  const petData = pets[pet];

  const upgradeCost = getPetCost(petData);
  const petInfo = getPetInfo(petData);

  console.log(`\n${pet} (${petData.category})`);
  console.log(`Max Level: ${petInfo.maxLevel} | XP Needed: ${petInfo.totalXpNeeded}`);
  console.log(`${upgradeCost} gold spread across ${getNumPetUpgrades(petData)} upgrades`);
  console.log(`Min Gold (Feed): ${petInfo.minXpCost} | Max Gold (Feed): ${petInfo.maxXpCost}`);
  console.log(`Min Total Cost: ${(petInfo.minXpCost+upgradeCost)} | Max Total Cost: ${(petInfo.maxXpCost+upgradeCost)}`);

});

console.log("travis_fold:end:pet_analysis");
