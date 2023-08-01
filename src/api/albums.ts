import { BASE_URL } from "./base";

const GROUP = `${BASE_URL}/albums`;
export const GET_ALL_ALBUMS = `${GROUP}`;
export const GET_SINGLE_ALBUM = `${GROUP}/id`;
export const GET_ALBUM_BY_NAME = `${GROUP}/name`;
export const GET_ALBUMS_USER_LIKE = `${GROUP}/interactions`;
