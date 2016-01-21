var geometry = require("./geometry");

function getElevations(se,sw,nw,image,callback){
  var width = 40;
  var height = 40;

  var incx = vectorMul(vectorSubtract(sphericalToCartesian(se),sphericalToCartesian(sw)),1/width);
  var incy = vectorMul(vectorSubtract(sphericalToCartesian(nw),sphericalToCartesian(sw)),1/height);
  var start = sphericalToCartesian(sw);

  var elevations;

  for(var y = 0; y <height; y++){
    for(var x = 0; x < width; x++){
      var position = cartesianToSpherical(vectorAdd(start, vectorAdd(vectorMul(incx,x),vectorMul(incy,y))));

      //geotiff has resolution of 16px per degree
      //this info can be procedurally gathered from geotiff in the future
      //Using floor is just a quick way to test this - interpolation would be better
      position.lat = Math.floor((90-position.lat)*16);
      position.lng = Math.floor((position.lng+180)*16);

      console.log(image.readRasters([position.lat,position.lng+1,position.lat+1,position.lng]));
      //elevations[y*width+x] = image.readRasters([position.lat,position.lng+1,position.lat+1,position.lng]);
    }
  }

}

module.exports = {
  getElevations: getElevations
};
