import { createSlice } from "@reduxjs/toolkit";
import { MusicPlayerState } from "../../models/MusicPlayerState";
import { RootState } from "../../app/store";

const initialState = {
    currentSong: -1,
    songList: [],
    playing: false,
    repeat: 0,
    random: false,
} as MusicPlayerState;

export const playerSlice = createSlice({
    name: "musicPlayer",
    initialState,
    reducers: {
        setSongList: (state, action) => {
            state.songList = action.payload;
        },
        setCurrentSong: (state, action) => {
            state.currentSong = action.payload;
        },
        toggleRandom: (state, action) => {
            state.random = action.payload ? false : true;
        },
        togglePlaying: (state, action) => {
            state.playing = action.payload ? false : true;
        },
        setRepeat: (state, action) => {
            state.repeat = (action.payload === 0) ? 1: (action.payload === 1 ? 2 : 0);
        },
        resetState: (state) => {
            state.currentSong = -1;
            state.songList = [];
            state.playing = false;
            state.repeat = 0;
            state.random = false;
        }
    }
});

export default playerSlice.reducer;

export const { setSongList, setCurrentSong, toggleRandom, togglePlaying, setRepeat, resetState } = playerSlice.actions;

export const selectCurrentSong = (state: RootState) => state.player.currentSong;
export const selectPlaying = (state: RootState) => state.player.playing;
export const selectSongList = (state: RootState) => state.player.songList;
export const selectRandom = (state: RootState) => state.player.random;
export const selectRepeat = (state: RootState) => state.player.repeat;
