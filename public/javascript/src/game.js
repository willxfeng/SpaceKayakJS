Game = {
  WIDTH: 800,
  HEIGHT: 500,
  BG_VOLUMN: 0.001,
  THRUSTERS_VOLUMN: 0.1,

  newRockChance: 0.01,

  start: function() {
    Crafty.init(Game.WIDTH, Game.HEIGHT);

    Crafty.scene('Loading');
  }
}
