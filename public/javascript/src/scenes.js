// Loading scene
// Handles loading of binary assets such as images and audio
Crafty.scene('Loading', function() {
  // Display text while assets are loading
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: Game.height/2-24, w: Game.width })
    .text('Loading game...')
    .textColor('white')
    .textFont({ type: 'italic', family: 'Arial', size: '24px'});

  Crafty.background('url(assets/images/space_bg.jpg)');

  // Load images
  Crafty.paths({
    audio: 'assets/sounds/',
    images: 'assets/images/'
  });

  var assetsObj = {
    'audio': {
      'bg_music': 'bg_music.ogg'
    },
    'images': ['crosshair.png']
  };

  Crafty.load(assetsObj, function() {
    Crafty.audio.play('bg_music', -1, Game.bg_volumn);
    Crafty.scene('Main');
  });
});

Crafty.scene('Main', function() {
  Crafty.log('main');
});
