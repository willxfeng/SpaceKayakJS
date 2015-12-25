// The Grid component allows an element to be located on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.mapGrid.tile.width,
      h: Game.mapGrid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return {
        x: this.x / Game.mapGrid.tile.width,
        y: this.y / Game.mapGrid.tile.height
      };
    } else {
      this.attr({
        x: x * Game.mapGrid.tile.width,
        y: y * Game.mapGrid.tile.height
      });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  }
})

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Solid, spr_tree');
  }
});

// A Bush is an Actor with a certain sprite
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, spr_bush');
  }
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
  init: function() {
    this.requires('Actor, Solid, spr_rock');
  }
});

// Player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
      .fourway(2)
      .onHit('Solid', this.stopMovement)
      .onHit('Village', this.visitVillage)
      // These next lines define our four animations
      // each call to .animante specifies:
      // - the name of the animations
      // - the x and y coordinates within the sprite
      //    map at which the animation set begins
      .reel('PlayerMovingUp', 600, 0, 0, 3)
      .reel('PlayerMovingRight', 600, 0, 1, 3)
      .reel('PlayerMovingDown', 600, 0, 2, 3)
      .reel('PlayerMovingLeft', 600, 0, 3, 3);

    // Watch for a change of direction and switch animation acoordingly
    var animationSpeed = 4;
    this.bind('NewDirection', function(data) {
      if (data.x > 0)
        this.animate('PlayerMovingRight', animationSpeed, -1);
      else if (data.x < 0)
        this.animate('PlayerMovingLeft', animationSpeed, -1);
      else if (data.y > 0)
        this.animate('PlayerMovingDown', animationSpeed, -1);
      else if (data.y < 0)
        this.animate('PlayerMovingUp', animationSpeed, -1);
      else
        this.pauseAnimation();
    });
  },

  // Stops the movement
  stopMovement: function() {
    // this._speed = 0;
    if(this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  // Respond to this player visiting a village
  visitVillage: function(data) {
    village = data[0].obj;
    village.visit();
  }
});

// A village is a tile on the grid that the PC must visit in order to win
Crafty.c('Village', {
  init: function() {
    this.requires('Actor, spr_village')
  },

  visit: function() {
    this.destroy();
    Crafty.audio.play('knock');
    Crafty.trigger('VillageVisited', this);
  }
});
