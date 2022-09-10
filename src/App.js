import React, { useEffect, useState } from "react";
import PhotoGallery from "react-photo-gallery";

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

    useEffect(() => {
        getPhotos().then(setPhotos);
    }, []);

    return <PhotoGallery photos={photos} />;
}

export default App;
