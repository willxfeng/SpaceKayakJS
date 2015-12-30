// Create a canvas wide component to track mouse movement
Crafty.c('MouseTracker', {
  init: function() {
    this.requires('2D, Mouse, Touch, Canvas');
  }
});

// The 'Actor' component inherits the 2D and DOM components
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, DOM');
  }
});

// The spaceship controlled by player
Crafty.c('SpaceKayak', {
  init: function() {
    WIDTH = 64;
    HEIGHT = 106;

    var duration = 400;
    this.requires('Actor, SpriteAnimation, Mouse, kayak')
      .reel('thrusters', duration, 0, 0, 8)
      .attr({ x: Game.width/2 - WIDTH/2, y: Game.height/2 - HEIGHT/4, z: 1 })
      .origin(WIDTH/2, HEIGHT/3);
  }
});
