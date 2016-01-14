// Loading scene
// Handles loading of binary assets such as images and audio
Crafty.scene('Loading', function() {
  BG_WIDTH = 2000;
  BG_HEIGHT = 7200; // Height of scrolling background image

  // Sprite dimensions
  KAYAK_W = 64;
  KAYAK_H = 106;
  EXP_W = 90;
  EXP_H = 90;
  ASTEROID_W = 85;
  ASTEROID_H = 75;
  FLARE_W = 50;
  FLARE_H = 26;

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
      'boom1': 'explosion1.ogg',
      'boom2': 'explosion2.ogg',
      'pew': 'pew.ogg'
    },
    'sprites': {
      'kayak.png': {
        'tile': KAYAK_W,
        'tileh': KAYAK_H,
        'map': { 'kayak': [0,0] }
      },
      'explosion1.png': {
        'tile': EXP_W,
        'tileh': EXP_H,
        'map': { 'explosion1': [0,0] }
      },
      'explosion2.png': {
        'tile': EXP_W,
        'tileh': EXP_H,
        'map': { 'explosion2': [0,0] }
      },
      'explosion3.png': {
        'tile': EXP_W,
        'tileh': EXP_H,
        'map': { 'explosion3': [0,0] }
      },
      'asteroids.png': {
        'tile': ASTEROID_W,
        'tileh': ASTEROID_H,
        'map': { 'a1': [0,0], 'a2': [1,0], 'a3': [2,0], 'a4': [3,0], 'a5': [4,0] }
      },
      'laser_flare.png': {
        'tile': FLARE_W,
        'tileh': FLARE_H,
        'map': { 'flare': [0,0] }
      }
    }
  };

  Crafty.load(assetsObj, function() {
    Crafty.audio.play('bg_music', -1, Game.BG_VOLUMN);
    Crafty.scene('Main');
  });
});

// Main Game scene
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

  Crafty.e('MouseTracker');
});
