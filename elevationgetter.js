var g = require("./geometry");

function getElevations(options,image,stream,callback){
  var se = options.se;
  var sw = options.sw;
  var nw = options.nw;

  //division by width and height is not correct, but works for now
  var incx = g.vectorMul(g.vectorSubtract(g.sphericalToCartesian(se),g.sphericalToCartesian(sw)),1/options.width);
  var incy = g.vectorMul(g.vectorSubtract(g.sphericalToCartesian(nw),g.sphericalToCartesian(sw)),1/options.height);
  var start = g.sphericalToCartesian(sw);

  var elevations = new Int16Array(options.width*options.height);

  for(var y = 0; y <options.height; y++){
    for(var x = 0; x < options.width; x++){
      var position = g.cartesianToSpherical(g.vectorAdd(start, g.vectorAdd(g.vectorMul(incx,x),g.vectorMul(incy,y))));

      //geotiff has resolution of 16px per degree
      //this info can be procedurally gathered from geotiff in the future
      //Using floor is just a quick way to test this - interpolation would be better
      position.lat = Math.floor((90-position.lat)*16);
      position.lng = Math.floor((position.lng+180)*16);

      //console.log(image.readRasters([position.lng,position.lat,position.lng+1,position.lat+1])[0][0]);
      elevations[y*options.width+x] = image.readRasters([position.lng,position.lat,position.lng+1,position.lat+1])[0][0];
      elevations[y*options.width+x] *= options.scale;
    }
  }

  callback(stream,elevations);
}

module.exports = {
  getElevations: getElevations
};
