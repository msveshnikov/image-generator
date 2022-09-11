import React, { useEffect, useState, useCallback } from "react";
import PhotoGallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Button, Input, Grid } from "@material-ui/core";

const API_URL = "https://mega.maxsoft.tk";

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

    const onChange = (event) => {
        setPromptText(event.target.value);
    };

    const handleClick = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptText }),
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
        fetch(`${API_URL}/images`)
            .then((res) => res.json())
            .then((res) =>
                res
                    .sort((a, b) => (a.name > b.name ? 1 : -1))
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
