Map = 

  store: {}

  playerLayer: false

  loadMap: (name, callback) ->
    $.getJSON "resources/map/#{name}.json", (json) ->
      Map.drawMap json
      $.getJSON "resources/map/#{name}_attributes.json", (json2) ->
        Map.store[name] =
          data: json
          attributes: json2
      Map.playerLayer = $('.layer-Player')
      callback()

  drawMap: (json) ->
    classNames = html = ""
    layerWidth = json.layers[0].width * 32
    classNames += Map.addTileset(tileset.name) + " " for tileset in json.tilesets

    for layer in json.layers
      html += "<div class='layer layer-#{layer.name}' style='width: #{layerWidth}px;'>"
      if layer.data?
        for tile, index in layer.data
          if loc = Map.tileNumberToLoc(tile, json.tilesets[0])
            newX = loc.x * 32
            newY = loc.y * 32
            html += "<div class='tile #{layer.name} tile-#{index} #{classNames}' style='background-position: -#{newX}px -#{newY}px;'></div>"
          else
            html += "<div class='tile #{layer.name} tile-#{index}'></div>"
      html += "</div>"

    $('#game').html(html)

  addTileset: (name) ->
    className = "tileset-#{name}"
    $('head').append("<style>.#{className}{ background-image: url('resources/img/#{name}.png');</style>")
    return className

  tileNumberToLoc: (number, tileset) ->
    if number > 0
      x = y = 0
      imageWidth = tileset.imagewidth / 32 - 1

      for i in [1...number]
        ++x
        if x > imageWidth
          ++y
          x = 0

      return { x: x, y: y }
    else
      return false