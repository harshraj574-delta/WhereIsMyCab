var mapOptions = {
  zoom: 17,
  center: new google.maps.LatLng(-34.397, 150.644),
  mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById('map_canvas'),
    mapOptions);
var GeoMarker = new GeolocationMarker(map);