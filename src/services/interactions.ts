import axios from "axios";
import {
  ADD_INTERACTIONS,
  DELETE_INTERACTIONS,
  LIKE_SONG,
  UNLIKE_SONG,
} from "../api/interactions";
import { getSongsLikedByUser } from "./songs";
import { ObjectRequest } from "../models/ObjectRequest";

export const likedSong = async (userId: number, songId: number) => {
  return await axios.post(`${LIKE_SONG}/${userId}/${songId}`);
};

export const unlikeSong = async (userId: number, songId: number) => {
  return await axios.post(`${UNLIKE_SONG}/${userId}/${songId}`);
};

export const checkLikedSong = async (userId: number, songId: number) => {
  const response = await getSongsLikedByUser(userId, songId);
  const songs = response.data.songs;
  return songs !== null;
};

export const likeObject = async (objectRequest: ObjectRequest) => {
  return await axios.post(`${ADD_INTERACTIONS}`, objectRequest);
};

export const dislikeObject = async (objectRequest: ObjectRequest) => {
  return await axios.post(`${DELETE_INTERACTIONS}`, objectRequest);
};
