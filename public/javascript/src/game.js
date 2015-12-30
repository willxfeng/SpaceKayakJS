Game = {
  WIDTH: 800,
  HEIGHT: 500,
  BG_VOLUMN: 1,
  THRUSTERS_VOLUMN: 0.4,

  start: function() {
    Crafty.init(Game.WIDTH, Game.HEIGHT);

    Crafty.scene('Loading');
  }
}
