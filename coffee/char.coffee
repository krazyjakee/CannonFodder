Character = 

  store: []

  get: (id) -> return player for player in Character.store when player.id is id
  set: (id, key, value) -> player[key] = value for player in Character.store when player.id is id

  loadPlayer: (sprite) ->
    id = 0
    elem = $("<div class='player sprite-#{sprite} char-#{id}'></div>").css "background-image", "url(resources/img/#{sprite}.png)"
    Map.playerLayer.append elem
    Character.store.push
      id: 0
      type: 'player'
      top: 0
      left: 0
      timer: false
      direction: ''
      elem: $('.player')
      spriteImg: sprite
      spriteX: 0
      spritePlay: false
      spriteIterator: setInterval ->
        if (charData = Character.get(id)).spritePlay
          if charData.spriteX is 2 then charData.spriteX = 0 else charData.spriteX = charData.spriteX+1
      , 100
    Character.setupInput 0
    Character.spriteMover 0

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

      Character.keysDown += direction if Character.keysDown.indexOf(direction) is -1

    $(document.body).on 'keyup', (e) ->
      charData = Character.get id
      switch e.which
        when 83 then Character.keysDown = Character.keysDown.replace(/s/g,'')
        when 68 then Character.keysDown = Character.keysDown.replace(/d/g,'')
        when 65 then Character.keysDown = Character.keysDown.replace(/a/g,'')
        when 87 then Character.keysDown = Character.keysDown.replace(/w/g,'')

  spriteMover: (id) ->
    Character.set id, 'timer', setInterval ->
      charData = Character.get id

      direction = ''
      direction += 's' if Character.keysDown.indexOf('s') > -1
      direction += 'd' if Character.keysDown.indexOf('d') > -1
      direction += 'a' if Character.keysDown.indexOf('a') > -1
      direction += 'w' if Character.keysDown.indexOf('w') > -1

      if direction then charData.spritePlay = true else charData.spritePlay = false

      spriteY = false
      for d in direction
        switch d
          when 'a'
            rules = { left: charData.left-- }
            spriteY = 96
          when 'd'
            rules = { left: charData.left++ }
            spriteY = 32
          when 'w'
            rules = { top: charData.top-- }
            spriteY = 0
          when 's'
            rules = { top: charData.top++ }
            spriteY = 64
        charData.elem.css rules
      
      charData.elem.css({ 'background-position': -(charData.spriteX*24) + 'px -' + spriteY + 'px' }) if spriteY > -1

      charData.direction = direction.split('').sort().join('')

    , 16
