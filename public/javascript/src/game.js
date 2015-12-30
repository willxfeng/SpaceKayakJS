Game = {
  width: 800,
  height: 500,
  bg_volumn: 1,
  start: function() {
    Crafty.init(Game.width, Game.height);

    Crafty.scene('Loading');
  }
}
