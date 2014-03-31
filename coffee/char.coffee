Character = 

  player: 
    id: 0
    elem: false

  store: []

  loadPlayer: (sprite) ->
    id = Character.store.length
    elem = $("<div class='player sprite-#{sprite} char-#{id}'></div>").css "background-image", "url(resources/img/#{sprite}.png)"
    Map.playerLayer.append elem
    Character.store.push
      id: id
      type: 'player'
      sprite: sprite
      top: 0
      left: 0
      timer: false
      direction: ''
    Character.player.id = id
    Character.player.elem = $ '.player'
    Character.setupInput id
    Character.spriteMover id

  keysDown: ''

  setupInput: (id) ->

    $(document.body).on 'keydown', (e) ->
      charData = Character.store[id]
      direction = ''
      switch e.which
        when 83 then direction = 's'
        when 68 then direction = 'd'
        when 65 then direction = 'a'
        when 87 then direction = 'w'

      if Character.keysDown.indexOf(direction) is -1
        Character.keysDown += direction

    $(document.body).on 'keyup', (e) ->
      charData = Character.store[id]
      switch e.which
        when 83
          Character.keysDown = Character.keysDown.replace(/s/g,'')
        when 68
          Character.keysDown = Character.keysDown.replace(/d/g,'')
        when 65
          Character.keysDown = Character.keysDown.replace(/a/g,'')
        when 87
          Character.keysDown = Character.keysDown.replace(/w/g,'')

  spriteMover: (id) ->
    Character.store[id].timer = setInterval ->
      charData = Character.store[id]

      direction = ''
      direction += 's' if Character.keysDown.indexOf('s') > -1
      direction += 'd' if Character.keysDown.indexOf('d') > -1
      direction += 'a' if Character.keysDown.indexOf('a') > -1
      direction += 'w' if Character.keysDown.indexOf('w') > -1

      for d in direction
        switch d
          when 'w' then rules = { top: charData.top-- }
          when 'a' then rules = { left: charData.left-- }
          when 's' then rules = { top: charData.top++ }
          when 'd' then rules = { left: charData.left++ }
        Character.player.elem.css rules

      charData.direction = direction.split('').sort().join('')
    , 10