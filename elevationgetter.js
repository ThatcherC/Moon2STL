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
      var lat = (90-position.lat)*16;
      var lng = (position.lng+180)*16

      //Get some values - double check this in GeoTIFF docs
      var samples = image.readRasters([Math.floor(lng),Math.floor(lat),Math.ceil(lng)+1,Math.ceil(lat)+1]);
      
      //Time for bilinear interpolation!
      //Do the x-direction interpolations first:
      var x1 = (Math.ceil(lng)-lng)*samples[0][0] + (lng-Math.floor(lng))*samples[0][1];
      var x2 = (Math.ceil(lng)-lng)*samples[0][2] + (lng-Math.floor(lng))*samples[0][3];
      
      //Interpolate those values in the y direction
      elevations[y*options.width+x] = (Math.ceil(lat)-lat)*x1 + (lat-Math.floor(lat))*x2;
      if(elevations[y*options.width+x]<-10000){
        elevations[y*options.width+x]+=32768;
      }
      elevations[y*options.width+x] *= options.scale;
    }
  }

  callback(stream,elevations);
}

module.exports = {
  getElevations: getElevations
};
