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
    this.requires('DOM, SpriteAnimation, Collision, kayak')
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
      })
      .collision()
      .onHit('Asteroid', function(e) {
      });
  },
  originX: function() {
    return this._x + this._w/2;
  },
  originY: function() {
    return this._y + this._h/3;
  }
});

// Explosion animation 1
Crafty.c('Explosion1', {
  init: function() {
    var duration = 400;
    this.requires('DOM, SpriteAnimation, explosion1')
      .reel('exp1', duration, 0, 0, 17)
      .bind('AnimationEnd', function() {
        this.destroy();
      });
  }
});

// Randomly generated asteroids
Crafty.c('Asteroid', {
  init: function() {
    this.requires('2D, DOM, Collision');

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

   var vMax = 5; //max x or y velocity for randomization
   var vrMax = 20; //max rotational speed

   // Starting position and velocity depends on which side rock originates
    var x0, y0;
    switch (Crafty.math.randomInt(1, 4)) {
      case 1:
        x0 = Crafty.math.randomInt(0, Game.WIDTH-this._w);
        y0 = -this._h;
        xv0 = Crafty.math.randomInt(-vMax, vMax);
        yv0 = Crafty.math.randomInt(1, vMax);
        break;
      case 2:
        x0 = Crafty.math.randomInt(0, Game.WIDTH-this._w);
        y0 = Game.HEIGHT;
        xv0 = Crafty.math.randomInt(-vMax, vMax);
        yv0 = Crafty.math.randomInt(-vMax, -1);
        break;
      case 3:
        x0 = -this._w;
        y0 = Crafty.math.randomInt(0, Game.HEIGHT-this._h);
        xv0 = Crafty.math.randomInt(1, vMax);
        yv0 = Crafty.math.randomInt(-vMax, vMax);
        break;
      case 4:
        x0 = Game.WIDTH;
        y0 = Crafty.math.randomInt(0, Game.HEIGHT-this._h);
        xv0 = Crafty.math.randomInt(-vMax, -1);
        yv0 = Crafty.math.randomInt(-vMax, vMax);
        break;
    }

    var boundScale = 1/6; // Scaling factor used when determining box for collision

    this.origin('center')
      .attr( {
        // Random starting positions and speeds
        x: x0,
        y: y0,
        xv: xv0,
        yv: yv0,
        rv: Crafty.math.randomInt(-vrMax, vrMax)
      }).bind("EnterFrame", function() {
        this.x += this.xv;
        this.y += this.yv;
        this.rotation += this.rv;
      })
      // Box to use for collision
      .collision([
        this._w * boundScale, this._h * boundScale,
        this._w * boundScale, this._h * (1 - boundScale),
        this._w * (1 - boundScale), this._h * boundScale,
        this._w * (1 - boundScale), this._h * (1 - boundScale)
      ])
      .onHit('border', function(e) {
        this.destroy();
        asteroidCount--;
      })
      .checkHits('Asteroid')
      .bind('HitOn', function(hitData) {
        target = hitData[0].obj; // The other asteroid

        // final velocities of an elastic collision for 2 objects of same mass
        xv1 = this.xv;
        yv1 = this.yv;
        this.xv = target.xv;
        this.yv = target.yv;
        target.xv = xv1;
        target.yv = yv1;
        this.rv = Crafty.math.randomInt(-vrMax, vrMax);

        // Generate explosion animation and play sound
        Crafty.e('Explosion1')
        .attr({
          x: (this.originX() + target.originX())/2 - EXP1_W/2,
          y: (this.originY() + target.originY())/2 - EXP1_H/2
         })
        .animate('exp1');
        Crafty.audio.play('boom1', 1, Game.EXPLOSION_VOLUMN)
      });
  },
  originX: function() {
    return this._x + this._w/2;
  },
  originY: function() {
    return this._y + this._h/3;
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
