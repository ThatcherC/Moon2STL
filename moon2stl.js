//Strongly based on https://developers.google.com/maps/documentation/javascript/examples/maptype-image

var rectangle;

//center of the box in Cartesian coordinates
var center = sphericalToCartesian(0,0);
//Cartesian vectors pointing from the center of the box the NE and NW corners
var nevec = vectorSubtract( s2c({lat:2,lng:2}),  s2c({lat:0,lng:0}) );
var nwvec = vectorSubtract( s2c({lat:2,lng:-2}), s2c({lat:0,lng:0}) );

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 1,
    streetViewControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['elev','moon']
    },
    mapTypeId: 'moon'
  });

  var moonVisible = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord) {
          return null;
        }
        var bound = Math.pow(2, zoom);
        return '//mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw' +
            '/' + zoom + '/' + normalizedCoord.x + '/' +
            (bound - normalizedCoord.y - 1) + '.jpg';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 6,
    minZoom: 2,
    radius: 1738000,
    name: 'Visible'
  });

  var moonElevation = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord) {
          return null;
        }
        var bound = Math.pow(2, zoom);
        return '//mw1.google.com/mw-planetary/lunar/lunarmaps_v1/terrain' +
            '/' + zoom + '/' + normalizedCoord.x + '/' +
            (bound - normalizedCoord.y - 1) + '.jpg';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 6,
    minZoom: 2,
    radius: 1738000,
    name: 'Elevation'
  });

  map.mapTypes.set('moon', moonVisible);
  map.mapTypes.set('elev', moonElevation);
  map.setMapTypeId('elev');

  var rectCoords = [
    {lat: -2, lng: 2},
    {lat: -2, lng: -2},
    {lat: 2, lng: -2},
    {lat: 2, lng: 2}
  ];

  rectangle = new google.maps.Polygon({
    strokeColor: '#FF0000',
    path: rectCoords,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    geodesic: true
  });
  rectangle.setDraggable(true);

  google.maps.event.addListener(rectangle, 'dragend', function() {
    console.log('Drag ended');

    document.getElementsByName("swlat")[0].value = rectangle.getPath().getAt(1).lat();
    document.getElementsByName("swlng")[0].value = rectangle.getPath().getAt(1).lng();
    document.getElementsByName("selat")[0].value = rectangle.getPath().getAt(0).lat();
    document.getElementsByName("selng")[0].value = rectangle.getPath().getAt(0).lng();
    document.getElementsByName("nwlat")[0].value = rectangle.getPath().getAt(2).lat();
    document.getElementsByName("nwlng")[0].value = rectangle.getPath().getAt(2).lng();

    //update center
    // nw - nwvec
    var nwpoint = {lat:rectangle.getPath().getAt(2).lat(), lng:rectangle.getPath().getAt(2).lng()};
    center = vectorSubtract(s2c( nwpoint ),nwvec);
  });

  initControls();
}


function initControls(){
  var boxSize = document.getElementById("size");
  var boxSizeLabel = document.getElementById("sizel");
  var scale = document.getElementById("vscale");
  var scaleLabel = document.getElementById("vscalel");

  boxSize.onchange = function(){
    boxSizeLabel.innerHTML = boxSize.value;

    var half = boxSize.value/2;

    var newBounds = [{lat: -half, lng:  half},
                     {lat: -half, lng: -half},
                     {lat:  half, lng: -half},
                     {lat:  half, lng:  half} ];
    /*
    This system of centers and vectors would work but will require some rotation vectors
    //set new vector sizes
    nevec = vectorSubtract( s2c({lat:half,lng:half}),  s2c({lat:0,lng:0}) );
    nwvec = vectorSubtract( s2c({lat:half,lng:-half}), s2c({lat:0,lng:0}) );

    newBounds[0] = c2s( vectorSubtract( center , nwvec ) );        //se
    newBounds[1] = c2s( vectorSubtract( center , nevec ) );        //sw
    newBounds[2] = c2s( vectorAdd( center , nwvec ) );             //nw
    newBounds[3] = c2s( vectorAdd( center , nevec ) );             //ne
    */
    console.log(newBounds);
    rectangle.setPath(newBounds);
  };

  scale.onchange = function(){
    scaleLabel.innerHTML = scale.value;
  };
}

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  var y = coord.y;
  var x = coord.x;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  var tileRange = 1 << zoom;

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    x = (x % tileRange + tileRange) % tileRange;
  }

  return {x: x, y: y};
}
