import axios from "axios";
import {
  GET_ALL_ARTIST,
  GET_ARTISTS_BY_NAME,
  GET_ARTISTS_LIKE_BY_USER,
  GET_SINGLE_ARTIST,
} from "../api/artists";

export const getAllArtist = async () => {
  return await axios.get(`${GET_ALL_ARTIST}`);
};

export const getSingleArtist = async (id: number) => {
  return await axios.get(`${GET_SINGLE_ARTIST}/${id}`);
};

export const getArtistsByName = async (name: string) => {
  return await axios.get(`${GET_ARTISTS_BY_NAME}/${name}`);
};

export const getArtistsUserLikeInfo = async (userId: number) => {
  return await axios.get(`${GET_ARTISTS_LIKE_BY_USER}/${userId}`);
};
