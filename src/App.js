import React, { useEffect, useState, useCallback } from "react";
import PhotoGallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Button, Input, Grid } from "@material-ui/core";
import axios from "axios";
import Copyright from "./Copyright";

const API_URL = "https://mega.maxsoft.tk";

const blacklist = [
    "00002.png",
    "00001.png",
    "00004.png",
    "00009.png",
    "00006.png",
    "00008.png",
    "00010.png",
    "00014.png",
    "00027.png",
    "00030.png",
    "00005.png",
    "00047.png",
    "00036.png",
    "00042.png",
    "00063.png",
    "00071.png",
    "00072.png",
];

function App() {
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [promptText, setPromptText] = useState("");

    const openLightbox = useCallback((event, { _, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const translate = async (text) => {
        try {
            if (!text) {
                return "";
            }
            var res = await axios.post(`https://libretranslate.de/detect`, { q: text });
            const lang = res.data[0].language;
            if (lang === "en") {
                return text;
            }
            let data = {
                q: text,
                source: lang,
                target: "en",
            };
            res = await axios.post(`https://libretranslate.de/translate`, data);
            return res.data.translatedText;
        } catch (e) {
            return text;
        }
    };

    const onChange = async (event) => {
        setPromptText(event.target.value);
    };

    const handleClick = async () => {
        const res = await axios.post(`${API_URL}/prompt`, { prompt: await translate(promptText) });
        if (res.data === "Started, will take ~30 minutes") {
            setButtonPressed(true);
        }
    };

    const checkBusy = async () => {
        const res = await axios.get(API_URL + "/busy");
        setButtonPressed(res.data);
    };

    const loadImages = async () => {
        const res = await axios.get(API_URL + "/images");
        setImages(
            res.data
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .filter((image) => !blacklist.includes(image.name))
                .map((image) => ({
                    src: API_URL + "/" + image.name,
                    width: 1,
                    height: 1,
                }))
        );
    };

    useEffect(() => {
        loadImages();
        checkBusy();
    }, []);

    return (
        <>
            <Input
                multiline={true}
                maxRows={3}
                fullWidth={true}
                style={{ padding: 12 }}
                autoComplete="true"
                value={promptText}
                onChange={onChange}
                placeholder="Portrait of a nice girl, 4k, detailed, trending in artstation, fantasy vivid colors (можно и по русски) "
            />
            <br />
            <br />
            <Grid container justifyContent="center">
                <Button
                    disabled={buttonPressed}
                    justify="center"
                    color="secondary"
                    variant="contained"
                    onClick={handleClick}
                >
                    {buttonPressed ? "Come back in 15 minutes" : "Generate!"}
                </Button>
            </Grid>

            <br />
            <PhotoGallery photos={images} onClick={openLightbox} />
            <ModalGateway>
                {viewerIsOpen && (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={currentImage}
                            views={images.map((x) => ({
                                ...x,
                                srcset: x.srcSet,
                                caption: x.title,
                            }))}
                        />
                    </Modal>
                )}
            </ModalGateway>
            <Copyright />
        </>
    );
}

export default App;
