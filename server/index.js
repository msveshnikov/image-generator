var express = require("express");
var serveIndex = require("serve-index");
var app = express();

app.use("/", serveIndex("txt2img-samples")); // shows you the file list
app.use("/", express.static("txt2img-samples")); // serve the actual files

app.listen(8080);
