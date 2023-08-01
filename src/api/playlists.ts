import { BASE_URL } from "./base";

const GROUP = `${BASE_URL}/playlists`;
export const GET_ALL_PLAYLISTS = `${GROUP}`;
export const GET_SINGLE_PLAYLIST = `${GROUP}/id`;
export const GET_PLAYLISTS_BY_NAME = `${GROUP}/name`;
export const GET_PLAYLISTS_BY_USER = `${GROUP}/user`;
export const GET_PLAYLISTS_USER_LIKE = `${GROUP}/interactions`;
