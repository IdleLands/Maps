
const _ = require('lodash');

const gidMap = {};
const blockers = [16, 17, 3, 33, 37, 38, 39, 44, 45, 46, 47, 50, 53, 54, 55];

module.exports.SimpleMap = class Map {
  constructor(path) {
    this.map = _.cloneDeep(require(`${path}`));

    this.tileHeight = this.map.tileheight;
    this.tileWidth = this.map.tilewidth;

    this.height = this.map.height;
    this.width = this.map.width;

    if(this.map && this.map.properties) {
      this.name = this.map.properties.name;
    }

    this.loadRegions();

    this.isNotCSV = !_.isArray(this.map.layers[0].data);
    this.isCompressed = this.map.layers[0].compression;
  }

  getTile(x, y) {
    const tilePosition = (y*this.width) + x;
    const tileObject = _.find(this.map.layers[2].objects, { x: this.tileWidth*x, y: this.tileHeight*(y+1) });

    return {
      terrain: gidMap[this.map.layers[0].data[tilePosition]] || 'Void',
      blocked: _.includes(blockers, this.map.layers[1].data[tilePosition]),
      blocker: gidMap[this.map.layers[1].data[tilePosition]],
      region: this.regions[tilePosition] || 'Wilderness',
      object: tileObject,
      path: this.path
    };
  }

  loadRegions() {
    this.regions = [];

    if(!this.map.layers[3]) return;

    _.each(this.map.layers[3].objects, region => {

      const startX = region.x / 16;
      const startY = region.y / 16;
      const width = region.width / 16;
      const height = region.height / 16;

      for(let x = startX; x < startX+width; x++) {
        for(let y = startY; y < startY+height; y++) {
          this.regions[(y*this.width)+x] = region.name;
        }
      }
    });
  }
}
