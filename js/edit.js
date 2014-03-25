var Editor;

Editor = {
  attributes: {},
  load: function(map) {
    return $.getJSON("resources/map/" + map + ".json", Editor.drawMap);
  },
  drawMap: function(json) {
    var classNames, editorLayerData, html, i, index, layer, layerWidth, loc, newX, newY, tile, tileset, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    classNames = "";
    _ref = json.tilesets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tileset = _ref[_i];
      classNames += Editor.addTileset(tileset.name) + " ";
    }
    html = "";
    editorLayerData = [];
    for (i = _j = 0, _ref1 = json.layers[0].data.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      editorLayerData.push(0);
    }
    json.layers.push({
      data: editorLayerData,
      name: 'editorLayer'
    });
    _ref2 = json.layers;
    for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
      layer = _ref2[_k];
      layerWidth = json.layers[0].width * 32;
      html += "<div class='layer layer-" + layer.name + "' style='width: " + layerWidth + "px;'>";
      if (layer.data != null) {
        _ref3 = layer.data;
        for (index = _l = 0, _len2 = _ref3.length; _l < _len2; index = ++_l) {
          tile = _ref3[index];
          if (loc = Editor.tileNumberToLoc(tile, json.tilesets[0])) {
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
    $('#game').html(html);
    return $('.tile.editorLayer').mousedown(function(e) {
      switch (e.which) {
        case 1:
          return Editor.addToAttributeList('block', 'red', this);
        case 3:
          return Editor.removeFromAttributeList('block', this);
      }
    });
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
      x = 0;
      y = 0;
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
  },
  addToAttributeList: function(attr, color, elem) {
    var id;
    $(elem).addClass(attr);
    id = Editor.classToId(elem);
    if (!Editor.attributeExists(attr, id)) {
      if (!Editor.attributes[attr]) {
        Editor.attributes[attr] = [];
      }
      return Editor.attributes[attr].push(id);
    }
  },
  removeFromAttributeList: function(attr, elem) {
    var i, id, n, _i, _len, _ref, _results;
    $(elem).removeClass(attr);
    id = Editor.classToId(elem);
    _ref = Editor.attributes[attr];
    _results = [];
    for (n = _i = 0, _len = _ref.length; _i < _len; n = ++_i) {
      i = _ref[n];
      if (i === id) {
        _results.push(Editor.attributes[attr].splice(n, 1));
      }
    }
    return _results;
  },
  classToId: function(elem) {
    var id;
    id = $(elem).attr('class').split('-');
    id = id[id.length - 1];
    return parseInt(id);
  },
  attributeExists: function(attr, id) {
    var i, _i, _len, _ref;
    if (Editor.attributes[attr]) {
      _ref = Editor.attributes[attr];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i === id) {
          return true;
        }
      }
      return false;
    }
  }
};
