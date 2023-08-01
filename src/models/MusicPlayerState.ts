import { SongExpandResponse } from "./SongResponse"

export interface MusicPlayerState {
    currentSong: number;
    songList: SongExpandResponse[];
    playing: boolean; // false: no, true: yes
    repeat: number; // 0: no repeat, 1: repeat the playlist, 2: repeat once
    random: boolean; // false: no, true: yes
}