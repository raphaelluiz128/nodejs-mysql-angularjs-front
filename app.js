var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();
const cors = require('cors');
app.use(cors({}));

app.use("/scripts", express.static(__dirname + "/app/scripts"));
app.use("/images", express.static(__dirname + "/app/images"));
app.use("/styles", express.static(__dirname + "/app/styles"));
app.use("/views", express.static(__dirname + "/app/views"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/modules", express.static(__dirname + "/app/modules"));
app.use(express.static(path.join(__dirname,'/app')));
app.listen((process.env.PORT || 3600), function(){
    console.log('./app/index.html');
});