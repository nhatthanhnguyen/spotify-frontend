import { BASE_URL } from "./base";

const GROUP = `${BASE_URL}/artist`;
export const GET_ALL_ARTIST = `${GROUP}`;
export const GET_SINGLE_ARTIST = `${GROUP}/id`;
export const GET_ARTISTS_BY_NAME = `${GROUP}/name`;
export const GET_ARTISTS_LIKE_BY_USER = `${GROUP}/interactions`;
