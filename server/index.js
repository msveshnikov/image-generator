const cors = require("cors");
const onError = require("./onError.js");
const fs = require("fs");
const express = require("express");
const serveIndex = require("serve-index");
const shell = require("shelljs");

const app = express();

const ALLOWED_ORIGIN = [
    "https://mega.maxsoft.tk",
    "http://localhost:3000",
    "https://maxsoft-diffusion.netlify.app",
    "ai.maxsoft.tk",
];

app.use(
    cors({
        origin: ALLOWED_ORIGIN,
    })
);
app.use(express.json());

app.use("/", serveIndex("txt2img-samples/samples")); // shows you the file list
app.use("/", express.static("txt2img-samples/samples")); // serve the actual files

app.get("/images", async (req, res) => {
    try {
        const fullPath = "txt2img-samples/samples";
        const dir = fs.opendirSync(fullPath);
        let entity;
        let listing = [];
        while ((entity = dir.readSync()) !== null) {
            if (entity.isFile()) {
                listing.push({ type: "f", name: entity.name });
            }
        }
        dir.closeSync();
        res.json(listing);
    } catch (err) {
        onError(err, res);
    }
});

app.post("/prompt", (req, res) => {
    if (!req.body.prompt) {
        return res.status(400).send({
            message: "prompt is required.",
        });
    }

    shell.exec('~/m "' + req.body.prompt + '"');

    return res.status(201).json("Started, will take ~30 minutes");
});

app.listen(8080);
