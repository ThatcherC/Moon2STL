
//valueObject: {xlen,ylen,scale,{values}}
function streamSTL(valueObject,stream,callback){
  var xlen = valueObject.xlen;
  var ylen = valueObject.ylen;
  var scale = valueObject.scale;

  var minimum = 100000;
  for(var b = 0; b<valueObject.values.length;b++){
    if(valueObject.values[b]<minimum){
      minimum=valueObject.values[b];
    }
  }
  console.log("Minimum: "+minimum);

  //topsurface
  for(var x = 0; x<valueObject.xlen-1; x++){
    for(var y =0; y<valueObject.ylen-1; y++){
      //First triangle
      var a = {'x':x,'y':y,'z':  (valueObject.values[x+y*xlen] - minimum) *scale};
      var b = {'x':x+1,'y':y,'z':(valueObject.values[x+1+y*xlen] - minimum) *scale};
      var c = {'x':x,'y':y+1,'z':(valueObject.values[x+(y+1)*xlen] - minimum) *scale};

      writeTriangle(a,b,c,stream);

      //Second triangle
      a = {'x':x+1,'y':y+1,'z':  (valueObject.values[x+1+(y+1)*xlen] - minimum) *scale};
      writeTriangle(b,a,c,stream);

      stream.flush();
    }


  }

  //bottom surface
  var a = {'x':0,'y':0,'z':0};
  var b = {'x':xlen-1,'y':0,'z':0};
  var c = {'x':xlen-1,'y':ylen-1,'z':0};
  writeTriangle(b,a,c,stream);
  var b = {'x':0,'y':ylen-1,'z':0};
  writeTriangle(a,b,c,stream);

  callback();
}

function writeTriangle(a,b,c,stream){
  var N = normalOf(a,b,c);
  //Normal
  stream.floatle(N.x).floatle(N.y).floatle(N.z);
  //Triangles
  stream.floatle(a.x).floatle(a.y).floatle(a.z);
  stream.floatle(b.x).floatle(b.y).floatle(b.z);
  stream.floatle(c.x).floatle(c.y).floatle(c.z);
  stream.uint8(0).uint8(0);
}

module.exports = {
  stream: streamSTL
};

function normalOf(p1, p2, p3){
	var u = {x:0,y:0,z:0};
  var v = {x:0,y:0,z:0};
  var r = {x:0,y:0,z:0};
	u.x = p2.x-p1.x;
	u.y = p2.y-p1.y;
	u.z = p2.z-p1.z;
	v.x = p3.x-p1.x;
	v.y = p3.y-p1.y;
	v.z = p3.z-p1.z;
	r.x = u.y*v.z-u.z*v.y;
	r.y = u.z*v.x-u.x*v.z;
	r.z = u.x*v.y-u.y*v.x;
	return r;
}
