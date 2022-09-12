const cors = require("cors");
const fs = require("fs");
const express = require("express");
const serveIndex = require("serve-index");
const shell = require("shelljs");
const app = express();

const ALLOWED_ORIGIN = [
    "https://mega.maxsoft.tk",
    "http://localhost:3000",
    "https://maxsoft-diffusion.netlify.app",
    "https://ai.maxsoft.tk",
];

app.use(
    cors({
        origin: ALLOWED_ORIGIN,
    })
);
app.use(express.json());

var busy = false;
app.get("/busy", async (req, res) => {
    res.json(busy);
});

app.get("/images", async (req, res) => {
    const fullPath = "txt2img-samples/samples";
    const dir = fs.opendirSync(fullPath);
    let entity;
    let listing = [];
    while ((entity = dir.readSync()) !== null) {
        if (entity.isFile()) {
            listing.push({ caption: "Caption", name: entity.name });
        }
    }
    dir.closeSync();
    res.json(listing);
});

app.post("/prompt", (req, res) => {
    if (!req.body.prompt) {
        return res.status(400).send({
            message: "prompt is required.",
        });
    }
    if (busy) {
        return res.status(400).send({
            message: "already in progress, please wait.",
        });
    }
    busy = true;
    shell.exec('~/m "' + req.body.prompt + '"', function (code, stdout, stderr) {
        busy = false;
    });
    return res.status(201).json("Started, will take ~30 minutes");
});

app.use("/", serveIndex("txt2img-samples/samples")); // shows you the file list
app.use("/", express.static("txt2img-samples/samples")); // serve the actual files

app.listen(8080);
