import { BASE_URL } from "./base";

const GROUP = `${BASE_URL}/songs`;
export const GET_ALL_SONGS = `${GROUP}`;
export const GET_SONG_BY_ID = `${GROUP}/id`;
export const GET_SONGS_BY_PLAYLIST = `${GROUP}/play_list`;
export const GET_SONGS_BY_ALBUM = `${GROUP}/album`;
export const GET_SONGS_BY_ARTIST = `${GROUP}/artist`;
export const GET_SONGS_BY_NAME = `${GROUP}/name`;
export const GET_SONGS_LIKED_BY_USER = `${GROUP}/interactions`;