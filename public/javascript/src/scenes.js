// Loading scene
// Handles loading of binary assets such as images and audio
Crafty.scene('Loading', function() {
  BG_WIDTH = 2000;
  BG_HEIGHT = 7200; // Height of scrolling background image

  // Sprite dimensions
  KAYAK_W = 64;
  KAYAK_H = 106;
  EXP1_W = 90;
  EXP1_H = 90;
  ASTEROID_W = 85;
  ASTEROID_H = 75;

  // Display text while assets are loading
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: Game.HEIGHT/2-24, w: Game.WIDTH })
    .text('Loading game...')
    .textColor('white')
    .textFont({ type: 'italic', family: 'Arial', size: '24px'});

  Crafty.background('url(assets/images/space_bg.jpg) black');
  // Start background at bottom
  Crafty.stage.elem.style.backgroundPosition =
    -(BG_WIDTH - Game.WIDTH)/2 + 'px ' + (-BG_HEIGHT + Game.HEIGHT) + 'px';

  // Load images
  Crafty.paths({
    audio: 'assets/sounds/',
    images: 'assets/images/'
  });

  var assetsObj = {
    'audio': {
      'bg_music': 'bg_music.ogg',
      'thrusters': 'thrusters.ogg',
      'boom1': 'explosion1.ogg'
    },
    'sprites': {
      'kayak.png': {
        'tile': KAYAK_W,
        'tileh': KAYAK_H,
        'map': { 'kayak': [0,0] }
      },
      'explosion1.png': {
        'tile': EXP1_W,
        'tileh': EXP1_H,
        'map': { 'explosion1': [0,0] }
      },
      'asteroids.png': {
        'tile': ASTEROID_W,
        'tileh': ASTEROID_H,
        'map': { 'a1': [0,0], 'a2': [1,0], 'a3': [2,0], 'a4': [3,0], 'a5': [4,0] }
      }
    }
  };

  Crafty.load(assetsObj, function() {
    Crafty.audio.play('bg_music', -1, Game.BG_VOLUMN);
    Crafty.scene('Main');
  });
});

Crafty.scene('Main', function() {
  VMAX = 6; // ship max velocity
  ACC = 0.1; // ship acceleration when thrusters are on
  DEACC = 0.99; // ship deacceleration when thrusters are off
  MIN_SPEED = 0.2; // mininum speed during deacceleration

  v = 0; // ship velocity
  xv = 0; // ship x velocity
  yv = 0; // ship y velocity

  frame = 0;

  asteroidCount = 0;
  asteroids = []; // array of asteroid entities

  Crafty.bind('EnterFrame', function(e) {
    // Scroll back ground up by 1 px per frame
    Crafty.stage.elem.style.backgroundPosition =
      -(BG_WIDTH - Game.WIDTH)/2 + 'px ' + (e.frame - BG_HEIGHT + Game.HEIGHT) + 'px';
    // Generate new asteroid
    if (Math.random() < Game.newRockChance) {
      Crafty.e('Asteroid');
      asteroidCount++;
    }
  });

  // Player controlled space ship (kayak)
  kayak = Crafty.e('SpaceKayak');

  // Create invisible border just outside game screen
  // Asteroids that touch this border are deleted
  Crafty.e('2D, border')
    .attr({ x: -100, y: -100, w: Game.WIDTH+200, h: 1 });
  Crafty.e('2D, border')
    .attr({ x: -100, y: -100, w: 1, h: Game.HEIGHT+200 });
  Crafty.e('2D, border')
    .attr({ x: Game.WIDTH+100, y: -100, w: 1, h: Game.HEIGHT+200 });
  Crafty.e('2D, border')
    .attr({ x: -100, y: Game.HEIGHT+100, w: Game.WIDTH+200, h: 1 });

  Crafty.e('MouseTracker')
    .attr({ x: 0, y: 0, w: Game.WIDTH, h: Game.HEIGHT })
    .bind("MouseDown", function(e) {
      if (e.mouseButton == Crafty.mouseButtons.LEFT)
        thrustersOn(kayak);
     })
     .bind("MouseUp", function(e) {
       if (e.mouseButton == Crafty.mouseButtons.LEFT)
         thrustersOff(kayak);
     });
});

var thrustersOn = function(kayak) {
  kayak.animate('thrusters', -1);
  Crafty.audio.play('thrusters', -1, Game.THRUSTERS_VOLUMN);

  kayak.unbind('EnterFrame', deaccelerate);
  kayak.bind('EnterFrame', accelerate);
}

var thrustersOff = function(kayak) {
  kayak.pauseAnimation();
  kayak.reelPosition(0);
  Crafty.audio.stop('thrusters');

  kayak.unbind('EnterFrame', accelerate);
  kayak.bind('EnterFrame', deaccelerate);
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
