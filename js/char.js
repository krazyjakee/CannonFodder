var Character;

Character = {
  player: {
    id: 0,
    elem: false
  },
  store: [],
  loadPlayer: function(sprite) {
    var elem, id;
    id = Character.store.length;
    elem = $("<div class='player sprite-" + sprite + " char-" + id + "'></div>").css("background-image", "url(resources/img/" + sprite + ".png)");
    Map.playerLayer.append(elem);
    Character.store.push({
      id: id,
      type: 'player',
      sprite: sprite,
      top: 0,
      left: 0,
      timer: false,
      direction: ''
    });
    Character.player.id = id;
    Character.player.elem = $('.player');
    Character.setupInput(id);
    return Character.spriteMover(id);
  },
  keysDown: '',
  setupInput: function(id) {
    $(document.body).on('keydown', function(e) {
      var charData, direction;
      charData = Character.store[id];
      direction = '';
      switch (e.which) {
        case 83:
          direction = 's';
          break;
        case 68:
          direction = 'd';
          break;
        case 65:
          direction = 'a';
          break;
        case 87:
          direction = 'w';
      }
      if (Character.keysDown.indexOf(direction) === -1) {
        return Character.keysDown += direction;
      }
    });
    return $(document.body).on('keyup', function(e) {
      var charData;
      charData = Character.store[id];
      switch (e.which) {
        case 83:
          return Character.keysDown = Character.keysDown.replace(/s/g, '');
        case 68:
          return Character.keysDown = Character.keysDown.replace(/d/g, '');
        case 65:
          return Character.keysDown = Character.keysDown.replace(/a/g, '');
        case 87:
          return Character.keysDown = Character.keysDown.replace(/w/g, '');
      }
    });
  },
  spriteMover: function(id) {
    return Character.store[id].timer = setInterval(function() {
      var charData, d, direction, rules, _i, _len;
      charData = Character.store[id];
      direction = '';
      if (Character.keysDown.indexOf('s') > -1) {
        direction += 's';
      }
      if (Character.keysDown.indexOf('d') > -1) {
        direction += 'd';
      }
      if (Character.keysDown.indexOf('a') > -1) {
        direction += 'a';
      }
      if (Character.keysDown.indexOf('w') > -1) {
        direction += 'w';
      }
      for (_i = 0, _len = direction.length; _i < _len; _i++) {
        d = direction[_i];
        switch (d) {
          case 'w':
            rules = {
              top: charData.top--
            };
            break;
          case 'a':
            rules = {
              left: charData.left--
            };
            break;
          case 's':
            rules = {
              top: charData.top++
            };
            break;
          case 'd':
            rules = {
              left: charData.left++
            };
        }
        Character.player.elem.css(rules);
      }
      return charData.direction = direction.split('').sort().join('');
    }, 10);
  }
};
