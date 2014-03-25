Editor = 

  attributes: {}

  load: (map) ->
    $.getJSON "resources/map/#{map}.json", Editor.drawMap

  drawMap: (json) ->
    classNames = ""
    for tileset in json.tilesets
      classNames += Editor.addTileset(tileset.name) + " "

    html = ""
    
    editorLayerData = []
    editorLayerData.push(0) for i in [0...json.layers[0].data.length]
    json.layers.push
      data: editorLayerData
      name: 'editorLayer'

    for layer in json.layers
      layerWidth = json.layers[0].width * 32
      html += "<div class='layer layer-#{layer.name}' style='width: #{layerWidth}px;'>"
      if layer.data?
        for tile, index in layer.data
          if loc = Editor.tileNumberToLoc(tile, json.tilesets[0])
            newX = loc.x * 32
            newY = loc.y * 32
            html += "<div class='tile #{layer.name} tile-#{index} #{classNames}' style='background-position: -#{newX}px -#{newY}px;'></div>"
          else
            html += "<div class='tile #{layer.name} tile-#{index}'></div>"
      html += "</div>"

    $('#game').html(html)

    $('.tile.editorLayer').mousedown (e) ->
      switch e.which
        when 1
          Editor.addToAttributeList  'block', 'red', @
        when 3
          Editor.removeFromAttributeList 'block', @

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
        ++x
        if x > imageWidth
          ++y
          x = 0

      { x: x, y: y }

    else
      false

  addToAttributeList: (attr, color, elem) ->
    $(elem).addClass attr
    id = Editor.classToId elem
    if !Editor.attributeExists attr, id
      if !Editor.attributes[attr] then Editor.attributes[attr] = []
      Editor.attributes[attr].push id

  removeFromAttributeList: (attr, elem) ->
    $(elem).removeClass attr
    id = Editor.classToId elem
    Editor.attributes[attr].splice(n, 1) for i, n in Editor.attributes[attr] when i is id

  classToId: (elem) ->
    id = $(elem).attr('class').split('-')
    id = id[id.length-1]
    parseInt id

  attributeExists: (attr, id) ->
    if Editor.attributes[attr]
      for i in Editor.attributes[attr]
        return true if i is id
      false
