var Character;

Character = {
  loadPlayer: function(sprite) {
    var elem;
    elem = $("<div class='player sprite-" + sprite + "'></div>").css("background-image", "url(resources/img/" + sprite + ".png)");
    return Map.playerLayer.append(elem);
  }
};
