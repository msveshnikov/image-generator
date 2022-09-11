import React, { useEffect, useState, useCallback } from "react";
import PhotoGallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Button, Input, Grid } from "@material-ui/core";
import axios from "axios";

const API_URL = "https://mega.maxsoft.tk";
const blacklist = ["00002.png", "00004.png", "00010.png", "00014.png", "00005.png"];

function App() {
    const [photos, setPhotos] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [promptText, setPromptText] = useState("");

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const translate = async (text) => {
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
    };

    const onChange = async (event) => {
        setPromptText(event.target.value);
    };

    const handleClick = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: await translate(promptText) }),
        };
        fetch(`${API_URL}/prompt`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data === "Started, will take ~30 minutes") {
                    setButtonPressed(true);
                }
            });
    };

    useEffect(() => {
        axios
            .get(`${API_URL}/images`)
            .then((res) =>
                res.data
                    .sort((a, b) => (a.name > b.name ? 1 : -1))
                    .filter((photo) => !blacklist.includes(photo.name))
                    .map((photo) => ({
                        src: `${API_URL}/${photo.name}`,
                        width: 1,
                        height: 1,
                    }))
            )
            .then((res) => setPhotos(res));
    }, []);

    return (
        <>
            <Input
                multiline={true}
                maxRows={2}
                fullWidth={true}
                style={{ padding: 12 }}
                autoComplete="true"
                value={promptText}
                onChange={onChange}
                placeholder="Portrait of a nice girl, 4k, detailed, trending in artstation, fantasy vivid colors"
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
                    {buttonPressed ? "Come back in 30 minutes" : "Generate!"}
                </Button>
            </Grid>

            <br />
            <PhotoGallery photos={photos} onClick={openLightbox} />
            <ModalGateway>
                {viewerIsOpen && (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={currentImage}
                            views={photos.map((x) => ({
                                ...x,
                                srcset: x.srcSet,
                                caption: x.title,
                            }))}
                        />
                    </Modal>
                )}
            </ModalGateway>
        </>
    );
}

export default App;
