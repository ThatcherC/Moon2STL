var http = require("http");
var Concentrate = require("concentrate");
var stlStreamer = require("./stlstreamer");

var count = 0;

http.createServer(function(req,res){
  console.time(count);
  var c = Concentrate();
  c.on("end", function() {
    res.end();
  }).on("readable", function() {
    c.pipe(res);
  });

  res.setHeader('Content-disposition', 'attachment; filename=' + req.url.slice(1));
  res.setHeader('Content-type', "application/sla");
  res.writeHead(200);

  var width = 5;
  var height = 5;

  elevationData = {xlen:width,ylen:height,values:[0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,2]};

  var triangleCount = (width-1)*(height-1)*2;	//number of facets in a void-free surface
	//triangleCount += 4*(width-1);	//triangle counts for the walls of the model
	//triangleCount += 4*(height-1);
	triangleCount += 2; 			//base triangles



  //Header
  c.string('tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt','utf8');
  //Triangle count
  c.uint32(triangleCount);

  stlStreamer.stream(elevationData,c,function(){
    c.flush().end();
    console.timeEnd(count);
    count++;
  });

}).listen(9000);
