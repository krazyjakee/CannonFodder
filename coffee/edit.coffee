Editor = 

  attributes: {}

  loadedMap: false

  load: (map) ->
    Editor.loadMaps()

    $('#save').click ->
      $.ajax
        url: 'q.php'
        data: "saveAttr=#{Editor.loadedMap}&value=" + JSON.stringify(Editor.attributes)
        method: 'POST'
        success: ->
          $('#save').html "Saved!"
          setTimeout ->
            $('#save').html "Save"
          , 5000

  loadMaps: ->
    $.get "q.php?loadMaps=1", (response) ->
      maps = eval response
      for m in maps
        $('#maps').append("<option value='#{m}'>#{m}</option>")
      firstmap = $('#maps option:first').val()
      Editor.loadedMap = firstmap.replace(".json","")
      $.getJSON "resources/map/#{firstmap}", Editor.drawMap
      

  drawMap: (json) ->
    classNames = html = ""
    editorLayerData = []
    layerWidth = json.layers[0].width * 32
    classNames += Editor.addTileset(tileset.name) + " " for tileset in json.tilesets

    editorLayerData.push(0) for i in [0...json.layers[0].data.length]
    json.layers.push
      data: editorLayerData
      name: 'editorLayer'

    for layer in json.layers
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

    Editor.loadAttributes Editor.loadedMap

    $('.tile.editorLayer').mousedown (e) ->
      attribute = $('input[name="attribute"]:checked').val()

      switch e.which
        when 1
          Editor.addToAttributeList attribute, @
        when 3
          Editor.removeFromAttributeList attribute, @

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

  addToAttributeList: (attr, elem) ->
    if attr?
      id = Editor.classToId elem
      if !Editor.attributeExists attr, id
        $(elem).addClass attr
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
      for k of Editor.attributes
        for i in Editor.attributes[k]
          return true if i is id
      return false
    return false

  loadAttributes: (name) ->
    $.getJSON "resources/map/#{name}_attributes.json", (json) ->
      for k of json
        for i in json[k]
          Editor.addToAttributeList k, $(".editorLayer.tile-#{i}")
      Editor.attributes = json