Character = 

	loadPlayer: (sprite) ->
    elem = $("<div class='player sprite-#{sprite}'></div>").css("background-image", "url(resources/img/#{sprite}.png)")
    Map.playerLayer.append elem