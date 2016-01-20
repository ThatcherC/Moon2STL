var express = require('express');
var Concentrate = require("concentrate");
var GeoTIFF = require("geotiff");
var fs = require("fs");

var stlStreamer = require("./stlstreamer");

var app = express();

var path = "ulcn2005_lpo_dd0.tif";
var moontiff;
var image;
fs.readFile(path, function(err, data) {
  if (err) throw err;
  moontiff = GeoTIFF.parse(data);
  image = moontiff.getImage();
  console.log(moontiff.fileDirectories[0][0]);
  console.log(moontiff.fileDirectories[0][1]);
  //console.log(moontiff.getImage().readRasters([1000,1000,1100,1010]));
});


var count = 0;

app.get("/stl",function(req,res){
  console.time(count);
  var c = Concentrate();
  c.on("end", function() {
    res.end();
  }).on("readable", function() {
    c.pipe(res);
  });

  res.setHeader('Content-disposition', 'attachment; filename=' + req.query.name);
  res.setHeader('Content-type', "application/sla");
  res.writeHead(200);

  var rasterWindow = [req.query.l,req.query.t,req.query.r,req.query.b];

  var width = rasterWindow[2]-rasterWindow[0];
  var height = rasterWindow[3]-rasterWindow[1];;

  elevationData = {xlen:width, ylen:height, scale:1/100, values: image.readRasters(rasterWindow)[0]};

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
});

app.listen(9000);
