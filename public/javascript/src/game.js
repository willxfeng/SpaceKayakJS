  Game = {
  WIDTH: 800,
  HEIGHT: 500,

  // BG_VOLUMN: 0.8,
  // THRUSTERS_VOLUMN: 0.1,
  // EXPLOSION1_VOLUMN: 0.1,
  // EXPLOSION2_VOLUMN: 0.3,
  // LASER_VOLUMN: 0.5,

  BG_VOLUMN: 0.0000000000001,
  THRUSTERS_VOLUMN: 0.0000000000001,
  EXPLOSION1_VOLUMN: 0.0000000000001,
  EXPLOSION2_VOLUMN: 0.0000000000001,
  LASER_VOLUMN: 0.0000000000001,

  newRockChance: 0.02,

  start: function() {
    Crafty.init(Game.WIDTH, Game.HEIGHT);
    Crafty.scene('Loading');
  }
}

var thrustersOn = function(kayak) {
  if(Crafty('SpaceKayak').length > 0) {
    kayak.animate('thrusters', -1);
    Crafty.audio.play('thrusters', -1, Game.THRUSTERS_VOLUMN);

    kayak.unbind('EnterFrame', deaccelerate);
    kayak.bind('EnterFrame', accelerate);
  }
}

var thrustersOff = function(kayak) {
  if(Crafty('SpaceKayak').length > 0) {
    kayak.pauseAnimation();
    kayak.reelPosition(0);
    Crafty.audio.stop('thrusters');

    kayak.unbind('EnterFrame', accelerate);
    kayak.bind('EnterFrame', deaccelerate);
  }
}

var accelerate = function() { moveShip(kayak, 'acc') }
var deaccelerate = function() { moveShip(kayak, 'deacc') }

var moveShip = function(kayak, mode) {
  switch (mode) {
    case 'acc':
      // Only turn on thrusters if cursor is outside bounds of kayak
      if (outsideBounds(kayak._w/2)) {
        if (v < VMAX)
          v += ACC;
        xv = v * Math.cos(angle);
        yv = v * Math.sin(angle);
      }
      break;
    case 'deacc':
      if (v > MIN_SPEED) {
        v *= DEACC;
        xv *= DEACC;
        yv *= DEACC;
      }
      break;
  }

  kayak.x += xv;
  kayak.y += yv;
}

// Determine if cursor ouside small area around kayak
var outsideBounds = function(limit) {
  return Math.pow(dx, 2) + Math.pow(dy, 2) >= Math.pow(limit, 2);
}
