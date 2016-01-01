// Game Scene
Crafty.scene('Game', function() {
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.mapGrid.width);
  for (var i = 0; i < Game.mapGrid.width; i++) {
    this.occupied[i] = new Array(Game.mapGrid.height);
    for (var y = 0; y < Game.mapGrid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(5, 5);
  this.occupied[this.player.at().x][this.player.at().y] = true;

  // Place a tree at every edge tile
  // Generate bushes at random locations
  for (var x = 0; x < Game.mapGrid.width; x++) {
    for (var y = 0; y < Game.mapGrid.height; y++) {
      var atEdge = x == 0 || x == Game.mapGrid.width - 1
        || y == 0 || y == Game.mapGrid.height - 1;

      if (atEdge) {
        // Place a tree entity at current tile
        Crafty.e('Tree').at(x, y);
        this.occupied[x][y] = true;
      } else if (Math.random() < 0.06 && !this.occupied[x][y]) {
        // Place a bush entity at the current tile
        var bush_or_rock = (Math.random() > 0.3) ? 'Bush' : 'Rock';
        Crafty.e(bush_or_rock).at(x, y);
        this.occupied[x][y] = true;
      }
    }
  }

  // Generate up to five villages at random locations
  var maxVillages = 5
  for (var x = 0; x < Game.mapGrid.width; x++) {
    for (var y = 0; y < Game.mapGrid.height; y++) {
      if (Math.random() < 0.03) {
        if (Crafty('Village').length < maxVillages && !this.occupied[x][y])
          Crafty.e('Village').at(x, y);
      }
    }
  }

  // Play a ringing sound to indicate the start of the journey
  Crafty.audio.play('ring');

  // Show the victory screen once all villages are visited
  this.showVictory = this.bind('VillageVisited', function() {
    if (!Crafty('Village').length)
      Crafty.scene('Victory');
  });
}, function() {
  // Remove event binding from above so we don't end up having multiple
  // redundant event watchers after multiple restarts of the game
  this.unbind('VillageVisited', this.showVictory);
});

// Victory scene
Crafty.scene('Victory', function() {
  // Display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .text('All villages visited!')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  // Give'em a round of applause
  Crafty.audio.play('applause');

  // Watch for player to press a key, then restart game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 3000);
  this.restart_game = function() {
    if (!delay)
      Crafty.scene('Game');
  };
}, function() {
  // Remove our event binding from above
  this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function() {
  // Draw some text for the player to see in case the file takes a noticeable
  // amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading. Please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  // Load our sprite map image
  Crafty.load([
    'assets/16x16_forest_2.gif',
    'assets/hunter.png',
    'assets/door_knock_3x.ogg',
    'assets/board_room_applause.ogg',
    'assets/candy_dish_lid.ogg'
    ], function() {
    // Once the image is loaded
    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
      spr_tree:     [0, 0],
      spr_bush:     [1, 0],
      spr_village:  [0, 1],
      spr_rock:     [1, 1]
    });

    // Define the PC's sprite to be the first sprite in the third row
    // of the animation sprite map
    Crafty.sprite(16, 'assets/hunter.png', {
      spr_player: [0, 2],
    }, 0, 2);

    // Define our sounds for later use
    Crafty.audio.add({
      knock:    ['assets/door_knock_3x.ogg'],
      applause: ['assets/board_room_applause.ogg'],
      ring:     ['assets/candy_dish_lid.ogg']
    });

    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
});
