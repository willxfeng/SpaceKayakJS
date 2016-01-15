// Create a canvas wide component to track mouse movement
Crafty.c('MouseTracker', {
  init: function() {
    this.requires('2D, Mouse, Touch')
      .attr({ x: 0, y: 0, w: Game.WIDTH, h: Game.HEIGHT })
      .bind("MouseDown", function(e) {
        if (e.mouseButton == Crafty.mouseButtons.LEFT)
          thrustersOn(kayak);
       })
       .bind("MouseUp", function(e) {
         if (e.mouseButton == Crafty.mouseButtons.LEFT)
           thrustersOff(kayak);
       })
       .bind('KeyDown', function(e) {
         if (e.key == Crafty.keys.SPACE) {
           FlareAndLaser();
           flareLoop = setInterval(function() {
             FlareAndLaser();
           }, 300);
         }
       })
       .bind('KeyUp', function(e) {
         if (e.key == Crafty.keys.SPACE)
           clearInterval(flareLoop);
       });
  }
});

var FlareAndLaser = function() {
  Crafty.audio.play('pew', Game.LASER_VOLUMN);
  Crafty.e('Flare')
   .animate('flare_flash');
  Crafty.e('Laser');
}

// The spaceship controlled by player
Crafty.c('SpaceKayak', {
  init: function() {
    var duration = 400;
    this.requires('DOM, SpriteAnimation, Collision, kayak')
      .reel('thrusters', duration, 0, 0, 8)
      .attr({ x: Game.WIDTH/2 - this._w/2, y: Game.HEIGHT/2 - this._h/4 })
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
      .onHit('Asteroid', function(hitData) {
        target = hitData[0].obj; // The asteroid that hit the ship

        var center_x = (this.originX() + target.originX())/2 - EXP_W/2;
        var center_y = (this.originY() + target.originY())/2 - EXP_H/2;

        // Generate explosion animation and play sound
        Crafty.e('Explosion2')
        .attr({
          x: center_x,
          y: center_y
         })
        .animate('exp2');
        Crafty.audio.play('boom2', 1, Game.EXPLOSION2_VOLUMN);

        var offset = EXP_W/3;
        var interval = 120; // time between explosions

        setTimeout(function() {
          Crafty.e('Explosion2')
          .attr({
            x: center_x + offset,
            y: center_y
           })
          .animate('exp2');
          Crafty.audio.play('boom2', 1, Game.EXPLOSION2_VOLUMN);
        }, interval);

        setTimeout(function() {
          Crafty.e('Explosion2')
          .attr({
            x: center_x,
            y: center_y + offset
           })
          .animate('exp2');
          Crafty.audio.play('boom2', 1, Game.EXPLOSION2_VOLUMN);
        }, interval * 2);

        setTimeout(function() {
          Crafty.e('Explosion2')
          .attr({
            x: center_x - offset,
            y: center_y
           })
          .animate('exp2');
          Crafty.audio.play('boom2', 1, Game.EXPLOSION2_VOLUMN);
        }, interval * 3);

        setTimeout(function() {
          Crafty.e('Explosion2')
          .attr({
            x: center_x - offset,
            y: center_y + offset
           })
          .animate('exp2');
          Crafty.audio.play('boom2', 1, Game.EXPLOSION2_VOLUMN);
        }, interval * 4);

        target.destroy();
        // this.destroy();
        Crafty.audio.stop('thrusters');
      });
  },
  // origin X and Y for rotation
  originX: function() {
    return this._x + this._w/2;
  },
  originY: function() {
    return this._y + this._h/3;
  }
});

//Laser flare animation
Crafty.c('Flare', {
  init: function() {
    var duration = 200;
    dist = 11; // distance from center of kayak to center of laser flares
    this.requires('DOM, SpriteAnimation, flare')
      .reel('flare_flash', duration, 0, 0, 2)
      .bind('animationEnd', function() {
        this.destroy();
      })
      .attr({
        x: kayak.originX() + dist*Math.cos(angle) - FLARE_W/2,
        y: kayak.originY() + dist*Math.sin(angle) - FLARE_H/2,
        z: 2
      })
      .origin('center')
      .bind('AnimationEnd', function() {
        this.destroy();
      })
      .rotation = kayak.rotation;
  }
});

// Laser projectile
Crafty.c('Laser', {
  init: function() {
    var speed = 10;
    this.requires('DOM, Collision, laser')
    .attr({
      x: kayak.originX() + dist*Math.cos(angle) - FLARE_W/2,
      y: kayak.originY () + dist*Math.sin(angle) - FLARE_H/2,
      xv: speed * Math.cos(angle),
      yv: speed * Math.sin(angle)
    })
    .origin(kayak.origin)
    .bind('EnterFrame', function(e) {
      this.x += this.xv;
      this.y += this.yv;
    })
    .collision()
    .onHit('Asteroid, border', function(hitData) {
      this.destroy();
      Crafty.log('laser on asteroid');
    })
    .rotation = kayak.rotation;
  }
});

// Explosion animation 1
Crafty.c('Explosion1', {
  init: function() {
    var duration = 500;
    this.requires('DOM, SpriteAnimation, explosion1')
      .reel('exp1', duration, 0, 0, 17)
      .bind('AnimationEnd', function() {
        this.destroy();
      });
  }
});

// Explosion animation 1
Crafty.c('Explosion2', {
  init: function() {
    var duration = 500;
    this.requires('DOM, SpriteAnimation, explosion2')
      .reel('exp2', duration, 0, 0, 17)
      .bind('AnimationEnd', function() {
        this.destroy();
      });
  }
});

// Explosion animation 1
Crafty.c('Explosion3', {
  init: function() {
    var duration = 400;
    this.requires('DOM, SpriteAnimation, explosion1')
      .reel('exp3', duration, 0, 0, 17)
      .bind('AnimationEnd', function() {
        this.destroy();
      });
  }
});

// Randomly generated asteroids
Crafty.c('Asteroid', {
  init: function() {
    this.requires('DOM, Collision');

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
          x: (this.originX() + target.originX())/2 - EXP_W/2,
          y: (this.originY() + target.originY())/2 - EXP_H/2
         })
        .animate('exp1');
        Crafty.audio.play('boom1', 1, Game.EXPLOSION1_VOLUMN);
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
