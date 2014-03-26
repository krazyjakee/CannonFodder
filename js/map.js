var Map;

Map = {
  store: {},
  playerLayer: false,
  loadMap: function(name, callback) {
    return $.getJSON("resources/map/" + name + ".json", function(json) {
      Map.drawMap(json);
      $.getJSON("resources/map/" + name + "_attributes.json", function(json2) {
        return Map.store[name] = {
          data: json,
          attributes: json2
        };
      });
      Map.playerLayer = $('.layer-Player');
      return callback();
    });
  },
  drawMap: function(json) {
    var classNames, html, index, layer, layerWidth, loc, newX, newY, tile, tileset, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    classNames = html = "";
    layerWidth = json.layers[0].width * 32;
    _ref = json.tilesets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tileset = _ref[_i];
      classNames += Map.addTileset(tileset.name) + " ";
    }
    _ref1 = json.layers;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      layer = _ref1[_j];
      html += "<div class='layer layer-" + layer.name + "' style='width: " + layerWidth + "px;'>";
      if (layer.data != null) {
        _ref2 = layer.data;
        for (index = _k = 0, _len2 = _ref2.length; _k < _len2; index = ++_k) {
          tile = _ref2[index];
          if (loc = Map.tileNumberToLoc(tile, json.tilesets[0])) {
            newX = loc.x * 32;
            newY = loc.y * 32;
            html += "<div class='tile " + layer.name + " tile-" + index + " " + classNames + "' style='background-position: -" + newX + "px -" + newY + "px;'></div>";
          } else {
            html += "<div class='tile " + layer.name + " tile-" + index + "'></div>";
          }
        }
      }
      html += "</div>";
    }
    return $('#game').html(html);
  },
  addTileset: function(name) {
    var className;
    className = "tileset-" + name;
    $('head').append("<style>." + className + "{ background-image: url('resources/img/" + name + ".png');</style>");
    return className;
  },
  tileNumberToLoc: function(number, tileset) {
    var i, imageWidth, x, y, _i;
    if (number > 0) {
      x = y = 0;
      imageWidth = tileset.imagewidth / 32 - 1;
      for (i = _i = 1; 1 <= number ? _i < number : _i > number; i = 1 <= number ? ++_i : --_i) {
        ++x;
        if (x > imageWidth) {
          ++y;
          x = 0;
        }
      }
      return {
        x: x,
        y: y
      };
    } else {
      return false;
    }
  }
};
