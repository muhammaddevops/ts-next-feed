import { Album } from "../interfaces/Album";
import { AlbumPhoto } from "../interfaces/AlbumPhoto";
import { api } from "./apiClient";

export const getAlbums = async () => {
  try {
    const res = await api.get<Album[]>(`/albums`);
    return res.data;
  } catch (error) {
    console.error("Error getting albums", error);
    throw error;
  }
};
export const getAlbumPhotos = async (id: number) => {
  try {
    const res = await api.get<AlbumPhoto[]>(`/albums/${id}/photos`);
    return res.data;
  } catch (error) {
    console.error("Error getting photos", error);
    throw error;
  }
};
