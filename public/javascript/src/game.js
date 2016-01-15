Game = {
  WIDTH: 800,
  HEIGHT: 500,
  BG_VOLUMN: 0.8,
  THRUSTERS_VOLUMN: 0.1,
  EXPLOSION1_VOLUMN: 0.1,
  EXPLOSION2_VOLUMN: 0.3,

  newRockChance: 0.05,

  start: function() {
    Crafty.init(Game.WIDTH, Game.HEIGHT);

    Crafty.scene('Loading');
  }
}
