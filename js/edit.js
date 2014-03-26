var Editor;

Editor = {
  attributes: {},
  loadedMap: false,
  load: function(map) {
    Editor.loadMaps();
    return $('#save').click(function() {
      return $.ajax({
        url: 'q.php',
        data: ("saveAttr=" + Editor.loadedMap + "&value=") + JSON.stringify(Editor.attributes),
        method: 'POST',
        success: function() {
          $('#save').html("Saved!");
          return setTimeout(function() {
            return $('#save').html("Save");
          }, 5000);
        }
      });
    });
  },
  loadMaps: function() {
    return $.get("q.php?loadMaps=1", function(response) {
      var firstmap, m, maps, _i, _len;
      maps = eval(response);
      for (_i = 0, _len = maps.length; _i < _len; _i++) {
        m = maps[_i];
        $('#maps').append("<option value='" + m + "'>" + m + "</option>");
      }
      firstmap = $('#maps option:first').val();
      Editor.loadedMap = firstmap.replace(".json", "");
      return $.getJSON("resources/map/" + firstmap, Editor.drawMap);
    });
  },
  drawMap: function(json) {
    var classNames, editorLayerData, html, i, index, layer, layerWidth, loc, newX, newY, tile, tileset, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    classNames = html = "";
    editorLayerData = [];
    layerWidth = json.layers[0].width * 32;
    _ref = json.tilesets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tileset = _ref[_i];
      classNames += Editor.addTileset(tileset.name) + " ";
    }
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
    Editor.loadAttributes(Editor.loadedMap);
    return $('.tile.editorLayer').mousedown(function(e) {
      var attribute;
      attribute = $('input[name="attribute"]:checked').val();
      switch (e.which) {
        case 1:
          return Editor.addToAttributeList(attribute, this);
        case 3:
          return Editor.removeFromAttributeList(attribute, this);
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
  },
  addToAttributeList: function(attr, elem) {
    var id;
    if (attr != null) {
      id = Editor.classToId(elem);
      if (!Editor.attributeExists(attr, id)) {
        $(elem).addClass(attr);
        if (!Editor.attributes[attr]) {
          Editor.attributes[attr] = [];
        }
        return Editor.attributes[attr].push(id);
      }
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
    var i, k, _i, _len, _ref;
    if (Editor.attributes[attr]) {
      for (k in Editor.attributes) {
        _ref = Editor.attributes[k];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (i === id) {
            return true;
          }
        }
      }
      return false;
    }
    return false;
  },
  loadAttributes: function(name) {
    return $.getJSON("resources/map/" + name + "_attributes.json", function(json) {
      var i, k, _i, _len, _ref;
      for (k in json) {
        _ref = json[k];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          Editor.addToAttributeList(k, $(".editorLayer.tile-" + i));
        }
      }
      return Editor.attributes = json;
    });
  }
};
