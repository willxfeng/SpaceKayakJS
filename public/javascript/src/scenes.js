// Loading scene
// Handles loading of binary assets such as images and audio
Crafty.scene('Loading', function() {
  BG_WIDTH = 2000;
  BG_HEIGHT = 7200; // Height of scrolling background image

  // Display text while assets are loading
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: Game.height/2-24, w: Game.width })
    .text('Loading game...')
    .textColor('white')
    .textFont({ type: 'italic', family: 'Arial', size: '24px'});

  Crafty.background('url(assets/images/space_bg.jpg) black');
  // Start background at bottom
  Crafty.stage.elem.style.backgroundPosition =
    -(BG_WIDTH - Game.width)/2 + 'px ' + (-BG_HEIGHT + Game.height) + 'px';

  // Load images
  Crafty.paths({
    audio: 'assets/sounds/',
    images: 'assets/images/'
  });

  var assetsObj = {
    'audio': {
      'bg_music': 'bg_music.ogg'
    },
    'sprites': {
      'kayak.png': {
        'tile': 64,
        'tileh': 106,
        'map': { 'kayak': [0, 0] }
      }
    }
  };

  Crafty.load(assetsObj, function() {
    Crafty.audio.play('bg_music', -1, Game.bg_volumn);
    Crafty.scene('Main');
  });
});

Crafty.scene('Main', function() {
  VMAX = 10; // ship max velocity
  ACC = 0.1; // ship acceleration when thrusters are on
  DEACC = 0.99; // ship deacceleration when thrusters are off
  MIN_SPEED = 0.2; // mininum speed during deacceleration

  v = 0; // ship velocity
  xv = 0; // ship x velocity
  yv = 0; // ship y velocity

  // Scroll back ground up by 1 px per frame
  Crafty.bind('EnterFrame', function(e) {
    Crafty.stage.elem.style.backgroundPosition =
      -(BG_WIDTH - Game.width)/2 + 'px ' + (e.frame - BG_HEIGHT + Game.height) + 'px';
  });

  kayak = Crafty.e('SpaceKayak');

  Crafty.e('MouseTracker')
    .attr({ x: 0, y: 0, w: Game.width, h: Game.height })
    .bind("MouseMove", function(e) { rotateKayak(kayak) })
    .bind("MouseDown", function(e) {
      if (e.mouseButton == Crafty.mouseButtons.LEFT)
        thrustersOn(kayak);
     })
     .bind("MouseUp", function(e) {
       if (e.mouseButton == Crafty.mouseButtons.LEFT)
         thrustersOff(kayak);
     });
});

var rotateKayak = function(kayak) {
  dx = Crafty.mousePos.x - (kayak.x + kayak.w/2);
  dy = Crafty.mousePos.y - (kayak.y + kayak.h/2);
  angle = Math.atan2(dy, dx);
  kayak.rotation = angle * 180 / Math.PI + 90;
}

var thrustersOn = function(kayak) {
  kayak.animate('thrusters', -1);
  Crafty.stage.elem.style.backgroundPosition = "200px";

  kayak.bind('EnterFrame', accelerate);
}

var thrustersOff = function(kayak) {
  kayak.pauseAnimation();
  kayak.reelPosition(0);

  kayak.unbind('EnterFrame', accelerate);
  kayak.bind('EnterFrame', function(e) { moveShip(kayak, 'deacc') });
}

var accelerate = function() { moveShip(kayak, 'acc') }
var deaccelerate = function() { moveShip(kayak, 'deacc') }

var moveShip = function(kayak, mode) {
  switch (mode) {
    case 'acc':
      if (v < VMAX)
        v += ACC;
      xv = v * Math.cos(angle);
      yv = v * Math.sin(angle);
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
