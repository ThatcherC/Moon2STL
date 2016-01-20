var d2r = Math.PI/180;

function sphericalToCartesian(s){
  var x = s.r*Math.sin(s.lat*d2r)*Math.cos(s.lng*d2r);
  var y = s.r*Math.sin(s.lat*d2r)*Math.sin(s.lng*d2r);
  var z = s.r*Math.sin(s.lat*d2r);
  return {x:x,y:y,z:z};
}
