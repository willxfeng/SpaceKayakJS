// The 'Actor' component inherits the 2D and DOM components
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, DOM');
  }
});

Crafty.c('SpaceKayak', {
  init: function() {
    this.requires('Actor, Fourway, kayak')
      .fourway(100);
  }
});
