Game = {
  width: 800,
  height: 500,
  bg_volumn: 0.0001,
  start: function() {
    Crafty.init(Game.width, Game.height);

    Crafty.scene('Loading');
  }
}
