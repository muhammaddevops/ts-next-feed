"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  styled,
  Dialog,
  IconButton,
} from "@mui/material";
import { AxiosError } from "axios";
import { getAlbums, getAlbumPhotos } from "../api/albums";
import { AlbumPhoto } from "../interfaces/AlbumPhoto";
import CloseIcon from "@mui/icons-material/Close";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface AlbumWithPhotos {
  id: number;
  title: string;
  photos: AlbumPhoto[];
}

const Vault = () => {
  const [albums, setAlbums] = useState<AlbumWithPhotos[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isPhotoOpen, setPhotoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getAlbums()
      .then(async (albums) => {
        const albumsPhotos = await Promise.all(
          albums.map(async (album) => {
            const photos = await getAlbumPhotos(album.id);
            return { ...album, photos };
          })
        );
        setAlbums(albumsPhotos);
        setIsLoading(false);
      })
      .catch((error: AxiosError) => {
        setError(`Failed to load albums: ${error.message}`);
        setIsLoading(false);
      });
  }, []);

  const handlePhotoClick = (url: string) => {
    setSelectedPhoto(url);
    setPhotoOpen(true);
  };

  const handleClose = () => {
    setPhotoOpen(false);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2}>
        {albums.map((album) => (
          <Grid item xs={12} sm={6} md={4} key={album.id}>
            <Typography variant="h6">{album.title}</Typography>
            {album.photos.map((photo) => (
              <Item key={photo.id} onClick={() => handlePhotoClick(photo.url)}>
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </Item>
            ))}
          </Grid>
        ))}
      </Grid>
      <Dialog open={isPhotoOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <IconButton
          onClick={handleClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        {selectedPhoto && (
          <img
            src={selectedPhoto}
            alt="Selected"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default Vault;
