console.log("travis_fold:start:verify_boss_parties");

const _ = require("lodash");

const bossparties = require("../../content/bossparties.json");
const bosses = require("../../content/boss.json");

_.each(bossparties, (partyData, party) => {
  for(let i = 0; i < partyData.members.length; i++) {
    const boss = partyData.members[i];
    if(!bosses[boss]) throw new Error `Boss (${boss}) does not exist.`;
  }
});

console.log("All bossparties seem to have bosses that exist.");

console.log("travis_fold:end:verify_boss_parties");
