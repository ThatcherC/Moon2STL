var express = require('express');
var bodyParser = require('body-parser');
var Concentrate = require("concentrate");
var GeoTIFF = require("geotiff");
var fs = require("fs");
var exec = require('child_process').exec;
var path = require('path');

var stlStreamer = require("./stlstreamer");
var elevation = require("./elevationgetter");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var count = 0;

app.post("/Moon2STL/stl",function(req,res){
  console.time(1);

  //Had a realllllly interesting bug here for awhile because it turns out that
  //JavaScript yields "10"*3 = 30, but "10"+3 = '103'
  var width = Number(req.body.width);
  var height = Number(req.body.height);

  var sw = {lat:Number(req.body.swlat), lng:Number(req.body.swlng)};
  var se = {lat:Number(req.body.selat), lng:Number(req.body.selng)};
  var nw = {lat:Number(req.body.nwlat), lng:Number(req.body.nwlng)};

  var modelOptions = {sw:sw, se:se, nw:nw, width:width, height:height, scale:req.body.scale};
  //console.log("./gtelevstlsrc/moon2stl "+sw.lat+" "+sw.lng+" "+se.lat+" "+se.lng+" "+nw.lat+" "+nw.lng+" "+width+" "+height+" "+req.body.scale);
  exec("./gtelevstlsrc/moon2stl "+sw.lat+" "+sw.lng+" "+se.lat+" "+se.lng+" "+nw.lat+" "+nw.lng+" "+width+" "+height+" "+req.body.scale+" > test.stl",
      function(error,stdout,stderr){
        console.timeEnd(1);
        console.log(stdout);
        console.log(error);
        console.log(stderr);
        res.download(path.resolve("test.stl"));
      });
});

app.listen(9000);
