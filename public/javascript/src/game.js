Game = {
  WIDTH: 800,
  HEIGHT: 500,
  BG_VOLUMN: 0.000000000000000000008,
  THRUSTERS_VOLUMN: 0.1,
  EXPLOSION_VOLUMN: 0.1,

  newRockChance: 0.03,

  start: function() {
    Crafty.init(Game.WIDTH, Game.HEIGHT);

    Crafty.scene('Loading');
  }
}
