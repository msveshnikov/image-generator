const cors = require("cors");
const onError = require("./onError.js");
const fs = require("fs");
const express = require("express");
const serveIndex = require("serve-index");
const app = express();

const ALLOWED_ORIGIN = [
    "https://swipe.maxsoft.tk",
    "https://swiper.ml",
    "https://www.swiper.ml",
    "https://develop--photo-swiper.netlify.app",
    "https://photo-swiper.netlify.app",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: ALLOWED_ORIGIN,
    })
);
app.use(express.json());

app.use("/", serveIndex("txt2img-samples")); // shows you the file list
app.use("/", express.static("txt2img-samples")); // serve the actual files

app.get("/images", async (req, res) => {
    try {
        const fullPath = "txt2img-samples";
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
    if (!req.body.eventType || !req.body.photoUrl || !req.body.userId) {
        return res.status(400).send({
            message: "eventType, photoUrl and userId are required.",
        });
    }

    const event = {
        ...req.body,
        createdAt: new Date(),
    };
    Event.create(event).catch(onError);
    return res.status(201).json(event);
});

app.listen(8080);
