import axios from "axios";
import {
  GET_SINGLE_PLAYLIST,
  GET_PLAYLISTS_BY_NAME,
  GET_PLAYLISTS_BY_USER,
  GET_ALL_PLAYLISTS,
  GET_PLAYLISTS_USER_LIKE,
} from "../api/playlists";
import { getAllAlbum } from "./albums";
import { getAllArtist } from "./artists";
import {
  PlaylistExpandResponse,
  PlaylistResponse,
} from "../models/PlaylistResponse";
import { AlbumResponse } from "../models/AlbumResponse";
import { ArtistResponse } from "../models/ArtistResponse";
import { getAccountInfo } from "./account";
import AccountResponse from "../models/AccountResponse";

export const getAllPlaylist = async () => {
  return await axios.get(`${GET_ALL_PLAYLISTS}`);
};

export const getSinglePlaylist = async (id: number) => {
  return await axios.get(`${GET_SINGLE_PLAYLIST}/${id}`);
};

export const getPlaylistByName = async (name: string) => {
  return await axios.get(`${GET_PLAYLISTS_BY_NAME}/${name}`);
};

export const getPlaylistByUser = async (userId: number) => {
  return await axios.get(`${GET_PLAYLISTS_BY_USER}/${userId}`);
};

export const getPlaylistsUserLike = async (userId: number) => {
  return await axios.get(`${GET_PLAYLISTS_USER_LIKE}/${userId}`);
};

export const getPlaylistsUserLikeInfo = async (userId: number) => {
  const responses = await Promise.all([getPlaylistsUserLike(userId)]);
  const playlists: PlaylistResponse[] = responses[0].data.playlists;
  const res: PlaylistExpandResponse[] = [];
  for (const playlist of playlists) {
    const response = await getAccountInfo(playlist.user_id);
    const account: AccountResponse = response.data.account;
    res.push({
      ...playlist,
      username: account?.username,
    });
  }
  return res;
};
