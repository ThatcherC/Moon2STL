var g = require("./geometry");

function getElevations(se,sw,nw,image,width,height,stream,callback){

  var incx = g.vectorMul(g.vectorSubtract(g.sphericalToCartesian(se),g.sphericalToCartesian(sw)),1/width);
  var incy = g.vectorMul(g.vectorSubtract(g.sphericalToCartesian(nw),g.sphericalToCartesian(sw)),1/height);
  var start = g.sphericalToCartesian(sw);

  var elevations = new Int16Array(width*height);

  for(var y = 0; y <height; y++){
    for(var x = 0; x < width; x++){
      var position = g.cartesianToSpherical(g.vectorAdd(start, g.vectorAdd(g.vectorMul(incx,x),g.vectorMul(incy,y))));

      //geotiff has resolution of 16px per degree
      //this info can be procedurally gathered from geotiff in the future
      //Using floor is just a quick way to test this - interpolation would be better
      position.lat = Math.floor((90-position.lat)*16);
      position.lng = Math.floor((position.lng+180)*16);

      //console.log(image.readRasters([position.lng,position.lat,position.lng+1,position.lat+1])[0][0]);
      elevations[y*width+x] = image.readRasters([position.lng,position.lat,position.lng+1,position.lat+1])[0][0];
    }
  }

  callback(stream,elevations);
}

module.exports = {
  getElevations: getElevations
};
