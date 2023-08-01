import axios from "axios";
import { AlbumExpandResponse, AlbumResponse } from "../models/AlbumResponse";
import { ArtistResponse } from "../models/ArtistResponse";
import { PlaylistExpandResponse, PlaylistResponse } from "../models/PlaylistResponse";
import { SongExpandResponse, SongResponse } from "../models/SongResponse";
import { getAlbumByName, getAllAlbum } from "./albums";
import { getAllArtist, getArtistsByName } from "./artists";
import { getPlaylistByName } from "./playlists";
import { getSongsByName } from "./songs";
import { SEND_AUDIO } from "../api/searchByAudio";
export const search = async (name: string) => {
    const responses = await Promise.all([getSongsByName(name), getAlbumByName(name), getArtistsByName(name), getPlaylistByName(name), getAllArtist(), getAllAlbum()]);
    const songsByName: SongResponse[] = responses[0].data.songs;
    const albumsByName: AlbumResponse[] = responses[1].data.albums;
    const artistsByName: ArtistResponse[] = responses[2].data.artists;
    const playlistsByName: PlaylistResponse[] = responses[3].data.play_lists;
    const allArtists: ArtistResponse[] = responses[4].data.artists;
    const allAlbums: AlbumResponse[] = responses[5].data.albums;
    const resultSongs: SongExpandResponse[] = [];
    const resultAlbums: AlbumExpandResponse[] = [];
    const resultPlaylists: PlaylistExpandResponse[] = [];
    const resultArtists: ArtistResponse[] = [];
    songsByName.forEach((song: SongResponse) => {
        const artist = allArtists.find((artist: ArtistResponse) => artist.artist_id === song.artist_id);
        const album = allAlbums.find((album: AlbumResponse) => album.album_id === song.album_id);
        resultSongs.push({
            ...song,
            artist_name: artist?.name as string,
            album_name: album?.name as string,
        })
    });
    playlistsByName.forEach((playlist: PlaylistResponse) => {
        resultPlaylists.push({...playlist, username: "truong", });
    })
    albumsByName.forEach((album: AlbumResponse) => {
        const artist = allArtists.find((artist: ArtistResponse) => artist.artist_id === album.artist_id);
        resultAlbums.push({
            ...album,
            artist_name: artist?.name as string,
        })
    });
    artistsByName.forEach((artist: ArtistResponse) => {
        resultArtists.push(artist);
    })
    return [resultSongs, resultAlbums, resultArtists, resultPlaylists];
}
export const searchByAudio = async (file: Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    return await axios.post(SEND_AUDIO, formData);
}