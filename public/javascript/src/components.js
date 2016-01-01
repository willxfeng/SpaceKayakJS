// Create a canvas wide component to track mouse movement
Crafty.c('MouseTracker', {
  init: function() {
    this.requires('2D, Mouse, Touch');
  }
});

// The spaceship controlled by player
Crafty.c('SpaceKayak', {
  init: function() {
    var duration = 400;
    this.requires('DOM, SpriteAnimation, kayak')
      .reel('thrusters', duration, 0, 0, 8)
      .attr({ x: Game.WIDTH/2 - this._w/2, y: Game.HEIGHT/2 - this._h/4, z: 1 })
      .origin(this._w/2, this._h/3)
      .bind('EnterFrame', function() {
        rotateKayak(kayak);
        // stage "wrapping"(i.e. if ship goes off left edge, appears on right)
        if (this._x < -this._w)
          this.x = Game.WIDTH;
        else if (this._x > Game.WIDTH)
          this.x = -this._w;
        else if (this._y < -this._h/2)
          this.y = Game.HEIGHT;
        else if (this._y > Game.HEIGHT)
          this.y = -this._h/2;
      });
  },
  originX: function() {
    return this._x + this._w/2;
  },
  originY: function() {
    return this._y + this._h/3;
  }
});

// Randomly generated asteroids
Crafty.c('Asteroid', {
  init: function() {
    this.requires('2D, DOM');
  
    // Randomize which asteroid image to draw
    switch (Crafty.math.randomInt(1, 5)) {
    case 1:
      this.requires('a1');
      break;
    case 2:
      this.requires('a2');
      break;
    case 3:
      this.requires('a3');
      break;
    case 4:
      this.requires('a4');
      break;
    case 5:
      this.requires('a5');
      break;
   }
   
   var vmax = 5; //max x or y velocity for randomization
   var vrmax = 20; //max rotational speed
  
  // Starting position and velocity depends on which side rock originates
  switch (Crafty.math.randomInt(1, 4)) {
    case 1:
      
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
  }

  this.origin('center')
    .attr( {
      // Random starting positions and speeds
      x: Crafty.math.randomInt(0, Game.WIDTH),
      y: Crafty.math.randomInt(0, Game.HEIGHT),
      xv: Crafty.math.randomInt(1, 5),
      yv: Crafty.math.randomInt(1, 5),
      rv: Crafty.math.randomInt(-20, 20)
    }).bind("EnterFrame", function() {
      this.x += this.xv;
      this.y += this.yv;
      this.rotation += this.rv;
    });
  }
});

// rotate Kayak to face cursor
var rotateKayak = function(kayak) {
  dx = Crafty.mousePos.x - kayak.originX();
  dy = Crafty.mousePos.y - kayak.originY();
  // only rotate ship if cursor outside bounds of kayak
  if (outsideBounds(kayak._w/2)) {
    angle = Math.atan2(dy, dx);
    kayak.rotation = angle * 180 / Math.PI + 90;
  }
}
