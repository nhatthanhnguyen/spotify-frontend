import axios from "axios";
import {
  GET_ALL_SONGS,
  GET_SONGS_BY_ALBUM,
  GET_SONGS_BY_ARTIST,
  GET_SONGS_BY_NAME,
  GET_SONGS_BY_PLAYLIST,
  GET_SONGS_LIKED_BY_USER,
  GET_SONG_BY_ID,
} from "../api/songs";
import { getAllAlbum } from "./albums";
import { getAllArtist } from "./artists";
import { SongExpandResponse, SongResponse } from "../models/SongResponse";
import { AlbumResponse } from "../models/AlbumResponse";
import { ArtistResponse } from "../models/ArtistResponse";
import { checkLikedSong } from "./interactions";

export const getAllSongs = async () => {
  return await axios.get(`${GET_ALL_SONGS}`);
};

export const getSongById = async (songId: number) => {
  return await axios.get(`${GET_SONG_BY_ID}/${songId}`);
};

export const getSongsByPlaylist = async (playlistId: number) => {
  return await axios.get(`${GET_SONGS_BY_PLAYLIST}/${playlistId}`);
};

export const getSongsByAlbum = async (albumId: number) => {
  return await axios.get(`${GET_SONGS_BY_ALBUM}/${albumId}`);
};

export const getSongsByArtist = async (artistId: number) => {
  return await axios.get(`${GET_SONGS_BY_ARTIST}/${artistId}`);
};

export const getSongsLikedByUser = async (userId: number, songId: number) => {
  return await axios.get(`${GET_SONGS_LIKED_BY_USER}/${userId}/${songId}`);
};

export const getSongsByName = async (name: string) => {
  return await axios.get(`${GET_SONGS_BY_NAME}/${name}`);
};

export const getSongsInfoOfPlaylist = async (playlistId: number) => {
  try {
    const responses = await Promise.all([
      getSongsByPlaylist(playlistId),
      getAllAlbum(),
      getAllArtist(),
    ]);
    const songs: SongResponse[] = responses[0].data.songs;
    const albums: AlbumResponse[] = responses[1].data.albums;
    const artists: ArtistResponse[] = responses[2].data.artists;
    const result: SongExpandResponse[] = [];
    songs.forEach((song: SongResponse, id) => {
      const album = albums.find(
        (album: AlbumResponse) => album.album_id === song.album_id
      );
      const artist = artists.find(
        (artist: ArtistResponse) => artist.artist_id === song.album_id
      );
      result.push({
        ...song,
        album_name: album?.name,
        artist_name: artist?.name,
      });
    });
    return result;
  } catch (error) {
    return [];
  }
};

export const getSongsInfoOfLikedSong = async (userId: number) => {
  try {
    const responses = await Promise.all([
      getAllSongs(),
      getAllAlbum(),
      getAllArtist(),
    ]);
    const songs: SongResponse[] = responses[0].data.songs;
    const albums: AlbumResponse[] = responses[1].data.albums;
    const artists: ArtistResponse[] = responses[2].data.artists;
    const result: SongExpandResponse[] = [];

    for (const song of songs) {
      const response = await checkLikedSong(userId, song.song_id);
      if (response === true) {
        const album = albums.find(
          (album: AlbumResponse) => album.album_id === song.album_id
        );
        const artist = artists.find(
          (artist: ArtistResponse) => artist.artist_id === song.album_id
        );
        result.push({
          ...song,
          album_name: album?.name,
          artist_name: artist?.name,
        });
      }
    }
    return result;
  } catch (error) {
    return [];
  }
};

export const getSongInfoById = async (songId: number) => {
  const responses = await Promise.all([
    getSongById(songId),
    getAllArtist(),
    getAllAlbum(),
  ]);
  const song: SongResponse = responses[0].data.songs[0];
  const artists: ArtistResponse[] = responses[1].data.artists;
  const albums: AlbumResponse[] = responses[2].data.albums;
  const artist = artists.find(
    (artist: ArtistResponse) => artist.artist_id === song.artist_id
  );
  const album = albums.find(
    (album: AlbumResponse) => album.album_id === song.album_id
  );
  return [
    {
      ...song,
      artist_name: artist?.name,
      album_name: album?.name,
    },
  ];
};
