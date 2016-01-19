var http = require("http");
var Concentrate = require("concentrate");
var stlStreamer = require("./stlstreamer");

http.createServer(function(req,res){
  var c = Concentrate();
  c.on("end", function() {
    console.log("ended");
    res.end();
  }).on("readable", function() {
    c.pipe(res);
  });

  res.setHeader('Content-disposition', 'attachment; filename=' + req.url.slice(1));
  res.setHeader('Content-type', "application/sla");
  res.writeHead(200);

  elevationData = {xlen:5,ylen:5,values:[0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1]};

  //Header
  c.string('tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt','utf8');
  //Triangle count
  c.uint32(32);

  stlStreamer.stream(elevationData,c,function(){
    c.flush().end();
  });

}).listen(9000);
