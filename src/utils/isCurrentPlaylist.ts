import { SongExpandResponse } from "../models/SongResponse";

export const isCurrentPlaylist = (playlist: SongExpandResponse[], currentPlaylist: SongExpandResponse[]) => {
    if (playlist.length !== currentPlaylist.length)
        return false;
    let ok = true;
    playlist.forEach((song: SongExpandResponse, index) => {
        if (song.song_id !== currentPlaylist[index].song_id) {
            ok = false;
        }
    });
    return ok;
}