Editor = 

  load: (map) ->
    $.getJSON "resources/map/#{map}.json", Editor.drawMap

  drawMap: (json) ->
    classNames = ""
    for tileset in json.tilesets
      classNames += Editor.addTileset(tileset.name) + " "

    html = ""
    for layer in json.layers
      layerWidth = json.layers[0].width * 32
      html += "<div class='layer layer-#{layer.name}' style='width: #{layerWidth}px;'>"
      if layer.data?
        for tile, index in layer.data
          if loc = Editor.tileNumberToLoc(tile, json.tilesets[0])
            newX = loc.x * 32
            newY = loc.y * 32
            html += "<div class='tile tile-#{layer.name}-#{index} #{classNames}' style='background-position: -#{newX}px -#{newY}px;'></div>"
          else
            html += "<div class='tile tile-#{layer.name}-#{index}'></div>"
      html += "</div>"
    $('#game').html(html)

  addTileset: (name) ->
    className = "tileset-#{name}"
    $('head').append("<style>.#{className}{ background-image: url('resources/img/#{name}.png');</style>")
    className

  tileNumberToLoc: (number, tileset) ->
    if number > 0

      x = 0
      y = 0

      imageWidth = tileset.imagewidth / 32 - 1
      for i in [1...number]
        if x > imageWidth
          ++y
          x = 0
        ++x

      { x: x, y: y }

    else
      false