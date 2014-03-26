$(window).load(function() {
  return Map.loadMap('testmap', function() {
    return Character.loadPlayer('soldier');
  });
});
