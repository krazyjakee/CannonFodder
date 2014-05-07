var Character;

Character = {
  store: [],
  get: function(id) {
    var player, _i, _len, _ref;
    _ref = Character.store;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      player = _ref[_i];
      if (player.id === id) {
        return player;
      }
    }
  },
  set: function(id, key, value) {
    var player, _i, _len, _ref, _results;
    _ref = Character.store;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      player = _ref[_i];
      if (player.id === id) {
        _results.push(player[key] = value);
      }
    }
    return _results;
  },
  loadPlayer: function(sprite) {
    var elem, id;
    id = 0;
    elem = $("<div class='player sprite-" + sprite + " char-" + id + "'></div>").css("background-image", "url(resources/img/" + sprite + ".png)");
    Map.playerLayer.append(elem);
    Character.store.push({
      id: 0,
      type: 'player',
      top: 0,
      left: 0,
      timer: false,
      direction: '',
      elem: $('.player'),
      spriteImg: sprite,
      spriteX: 0,
      spritePlay: false,
      spriteIterator: setInterval(function() {
        var charData;
        if ((charData = Character.get(id)).spritePlay) {
          if (charData.spriteX === 2) {
            return charData.spriteX = 0;
          } else {
            return charData.spriteX = charData.spriteX + 1;
          }
        }
      }, 100)
    });
    Character.setupInput(0);
    return Character.spriteMover(0);
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
      charData = Character.get(id);
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
    return Character.set(id, 'timer', setInterval(function() {
      var charData, d, direction, rules, spriteY, _i, _len;
      charData = Character.get(id);
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
      if (direction) {
        charData.spritePlay = true;
      } else {
        charData.spritePlay = false;
      }
      spriteY = false;
      for (_i = 0, _len = direction.length; _i < _len; _i++) {
        d = direction[_i];
        switch (d) {
          case 'a':
            rules = {
              left: charData.left--
            };
            spriteY = 96;
            break;
          case 'd':
            rules = {
              left: charData.left++
            };
            spriteY = 32;
            break;
          case 'w':
            rules = {
              top: charData.top--
            };
            spriteY = 0;
            break;
          case 's':
            rules = {
              top: charData.top++
            };
            spriteY = 64;
        }
        charData.elem.css(rules);
      }
      if (spriteY > -1) {
        charData.elem.css({
          'background-position': -(charData.spriteX * 24) + 'px -' + spriteY + 'px'
        });
      }
      return charData.direction = direction.split('').sort().join('');
    }, 16));
  }
};
