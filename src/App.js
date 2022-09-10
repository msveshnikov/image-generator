import React, { useEffect, useState, useCallback } from "react";
import PhotoGallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

const API_URL = "https://mega.maxsoft.tk";

export async function getPhotos() {
    const response = await fetch(`${API_URL}/images`);
    const photoData = await response.json();

    return photoData.map((photo) => ({
        src: `${API_URL}/${photo.name}`,
        width: 1,
        height: 1,
    }));
}

function App() {
    const [photos, setPhotos] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    useEffect(() => {
        getPhotos().then(setPhotos);
    }, []);

    return (
        <>
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
