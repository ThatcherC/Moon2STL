#include <cmath>
#include <Vector.h>

const float d2r = Math.PI/180;
const float r2d = 180/Math.PI;

Vector sphericalToCartesian(s){
  var x = Math.cos(s.lat*d2r)*Math.cos(s.lng*d2r);
  var y = Math.cos(s.lat*d2r)*Math.sin(s.lng*d2r);
  var z = Math.sin(s.lat*d2r);
  return {x:x,y:y,z:z};
}

Vector vectorSubtract(v1,v2){
  return {x:v1[0]-v2[0], y:v1.y-v2.y, z:v1.z-v2.z};
}

Vector vectorMul(v1,s){
  return {x:v1.x*s, y:v1.y*s, z:v1.z*s};
}

Vector vectorAdd(v1,v2){
  return {x:v1.x+v2.x, y:v1.y+v2.y, z:v1.z+v2.z};
}

function cartesianToSpherical(c){
  var lat = Math.atan(c.z/Math.sqrt(c.x*c.x+c.y*c.y));
  var lng = Math.atan2(c.y,c.x);
  return {lat:lat*r2d, lng:lng*r2d};
}

var c2s = cartesianToSpherical;
var s2c = sphericalToCartesian;
