//test reference function
var t = 0;
var delta = vectorSubtract(sphericalToCartesian(se),sphericalToCartesian(sw));
var inc = vectorMul(delta,1/40);

function advanceMarker(increment){
  marker = new google.maps.Marker({
    position: cartesianToSpherical(vectorAdd(sphericalToCartesian(myLatLng), vectorMul(increment,t))),
    map: map,
    title: 'Hello World!'
  });
  console.log(cartesianToSpherical(vectorAdd(sphericalToCartesian(myLatLng), vectorMul(increment,t))));
  t++;
  t=t%40;
}
