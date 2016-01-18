var http = require("http");
var Concentrate = require("concentrate");

http.createServer(function(req,res){

  var c = Concentrate();
  c.on("end", function() {
    console.log("ended");
    res.end();
  });

  c.on("readable", function() {
    /*var e;
    while (e = c.read()) {
      console.log(e);
    }*/
    c.pipe(res);
  });

  res.setHeader('Content-disposition', 'attachment; filename=' + req.url.slice(1));
  res.setHeader('Content-type', "application/sla");
  res.writeHead(200);

  //Header
  c.string('tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt','utf8');
  //Triangle count
  c.uint32(1);
  //Normal
  c.floatle(1).floatle(1).floatle(1);
  //Triangles
  c.floatle(1).floatle(0).floatle(0);
  c.floatle(0).floatle(1).floatle(0);
  c.floatle(0).floatle(0).floatle(1);
  //End tag
  c.uint8(0).uint8(0);
  c.flush().end();

}).listen(9000);
