Game = {
  // Define grid size and size of each of its tiles
  mapGrid: {
    width: 24,
    height: 16,
    tile: {
      width: 16,
      height: 16
    }
  },

  // Total width of the game screen
  width: function() {
    return this.mapGrid.width * this.mapGrid.tile.width;
  },

// Total height of game screen
  height: function() {
    return this.mapGrid.height * this.mapGrid.tile.height;
  },

  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color
    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(87, 109, 20)');

    // Start the "Game" scene to get things going
    Crafty.scene('Loading');
  }
}

$text_css = {
  'size': '24px',
  'family': 'Arial',
  'color': 'white',
  'text-align': 'center'
}
