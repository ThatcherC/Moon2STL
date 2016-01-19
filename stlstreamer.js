
//valueObject: {xlen,ylen,{values}}
function streamSTL(valueObject,stream,callback){
  var xlen = valueObject.xlen;
  //topsurface
  for(var x = 0; x<valueObject.xlen-1; x++){
    for(var y =0; y<valueObject.ylen-1; y++){
      //First triangle
      var a = {'x':x,'y':y,'z':valueObject.values[x*xlen+y]};
      var b = {'x':x+1,'y':y,'z':valueObject.values[(x+1)*xlen+y]};
      var c = {'x':x,'y':y+1,'z':valueObject.values[x*xlen+y+1]};

      var N = normalOf(a,b,c);
      //Normal
      stream.floatle(N.x).floatle(N.y).floatle(N.z);
      //Triangles
      stream.floatle(a.x).floatle(a.y).floatle(a.z);
      stream.floatle(b.x).floatle(b.y).floatle(b.z);
      stream.floatle(c.x).floatle(c.y).floatle(c.z);
      stream.uint8(0).uint8(0);

      //Second triangle
      a = {'x':x+1,'y':y+1,'z':valueObject.values[(x+1)*xlen+y+1]};
      N = normalOf(b,a,c);
      //Normal
      stream.floatle(N.x).floatle(N.y).floatle(N.z);
      //Triangles
      stream.floatle(b.x).floatle(b.y).floatle(b.z);
      stream.floatle(a.x).floatle(a.y).floatle(a.z);
      stream.floatle(c.x).floatle(c.y).floatle(c.z);
      stream.uint8(0).uint8(0);

      stream.flush();
    }
  }

  //bottom surface


  callback();
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
