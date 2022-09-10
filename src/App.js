import React, { useEffect, useState, useCallback } from "react";
import PhotoGallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Button, Input, Grid } from "@material-ui/core";

const API_URL = "https://mega.maxsoft.tk";

export async function getPhotos() {
    const response = await fetch(`${API_URL}/images`);
    const photoData = await response.json();

    return photoData
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((photo) => ({
            src: `${API_URL}/${photo.name}`,
            width: 1,
            height: 1,
        }));
}

function App() {
    const [photos, setPhotos] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
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
        console.log(promptText);
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptText }),
        };
        fetch(`${API_URL}/prompt`, requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));
    };

    useEffect(() => {
        getPhotos().then(setPhotos);
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
                <Button justify="center" color="secondary" variant="contained" onClick={handleClick}>
                    Generate!
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
