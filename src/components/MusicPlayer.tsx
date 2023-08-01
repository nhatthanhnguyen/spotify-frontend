import { Box, IconButton, Paper, Slider, Stack, Typography } from "@mui/material";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import { SyntheticEvent, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Link } from "react-router-dom";
import { selectCurrentSong, selectPlaying, selectRandom, selectRepeat, selectSongList, setCurrentSong, setRepeat, togglePlaying, toggleRandom } from "../features/player/playerSlice";
import { convertToMinuteAndSecond } from "../utils/convert";
import LikeButton from "./LikeButton";
import { selectUser } from "../features/auth/authSlice";

const MusicPlayer = () => {
    const dispatch = useAppDispatch();
    const playing = useAppSelector(selectPlaying);
    const currentSong = useAppSelector(selectCurrentSong);
    const songList = useAppSelector(selectSongList);
    const random = useAppSelector(selectRandom);
    const repeat = useAppSelector(selectRepeat);
    const user = useAppSelector(selectUser);
    const [stateVolume, setStateVolume] = useState<number>(100);
    const [dur, setDur] = useState(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [mute, setMute] = useState(false);
    let audio = useRef<HTMLAudioElement>(new Audio());
    const handleTimeChange = (event: Event, newValue: number | number[]) => {
        setCurrentTime(newValue as number);
        if (currentSong !== -1) {
            audio.current.currentTime = (newValue as number) / 100 * dur;
        }
    }
    const handleVolumeChange = (event: Event, newValue: number | number[]) => {
        if ((newValue as number) === 0)
            setMute(true);
        else
            setMute(false);
        setStateVolume(newValue as number);
        audio.current.volume = (newValue as number) / 100;
    }
    const handleMuteChange = (mute: boolean) => {
        if (mute === true) {
            setStateVolume(100);
            audio.current.volume = 1;
        } else {
            setStateVolume(0);
            audio.current.volume = 0;
        }
        setMute(!mute);
    }
    const handleRandomChange = () => {
        dispatch(toggleRandom(random));
    }
    const handleRepeatChange = () => {
        dispatch(setRepeat(repeat));
    }
    const handleSkipRandom = () => {
        const nextIndex = Math.floor((Math.random() * songList.length));
        audio.current.src = songList[nextIndex].url;
        audio.current.currentTime = 0;
        dispatch(setCurrentSong(nextIndex));
        setDur(songList[nextIndex].length);
    }
    const handleEndOfSong = () => {
        if (random) {
            handleSkipRandom();
            return;
        }
        if (repeat === 2) {
            audio.current.currentTime = 0;
            return;
        }
        handleSkipNext();
    }
    const handleSkipPrevious = () => {
        if (currentSong !== -1) {
            if (random) {
                handleSkipRandom();
                return;
            }
            if (repeat === 0 || repeat === 2) {
                if (currentSong === 0) {
                    audio.current.pause();
                    audio.current.src = "";
                    audio.current.currentTime = 0;
                    dispatch(setCurrentSong(-1));
                    dispatch(togglePlaying(true));
                    setDur(0);
                    return;
                }
                setDur(songList[currentSong - 1].length);
                dispatch(setCurrentSong(currentSong - 1));
                return;
            }
            if (currentSong === 0) {
                audio.current.src = songList[songList.length - 1].url;
                audio.current.currentTime = 0;
                setDur(songList[songList.length - 1].length);
                dispatch(setCurrentSong(songList.length - 1));
                return;
            }
            setDur(songList[currentSong - 1].length);
            dispatch(setCurrentSong(currentSong - 1));
            return;
        }
    }
    const handleSkipNext = () => {
        const songListLength = songList.length;
        if (currentSong !== -1) {
            if (random) {
                handleSkipRandom();
                return;
            }
            if (repeat === 0 || repeat === 2) {
                if (currentSong === songListLength - 1) {
                    audio.current.pause();
                    audio.current.src = "";
                    audio.current.currentTime = 0;
                    dispatch(setCurrentSong(-1));
                    dispatch(togglePlaying(true));
                    setDur(0);
                    return;
                }
                setDur(songList[currentSong + 1].length);
                dispatch(setCurrentSong(currentSong + 1));
                return;
            }
            if (currentSong === songListLength - 1) {
                audio.current.src = songList[0].url;
                audio.current.currentTime = 0;
                setDur(songList[0].length);
                dispatch(setCurrentSong(0));
                return;
            }
            setDur(songList[currentSong + 1].length);
            dispatch(setCurrentSong(currentSong + 1));
            return;
        }
    }
    const toggleAudio = () => {
        if (audio.current.paused) {
            audio.current.play();
            dispatch(togglePlaying(false));
        } else {
            audio.current.pause();
            dispatch(togglePlaying(true));
        }
    }
    if (currentSong !== -1) {
        if (audio.current.src === "" || audio.current.src !== songList[currentSong].url) {
            audio.current.src = songList[currentSong].url;
            audio.current.volume = stateVolume / 100;
            audio.current.currentTime = 0;
            if (dur === 0 || dur !== songList[currentSong].length) {
                setDur(songList[currentSong].length);
            }
        }
        if (playing) {
            if (user.username.length === 0) {
                audio.current.pause();
            } else {
                audio.current.play();
            }
        } else {
            audio.current.pause();
        }
    } else {
        audio.current.pause();
        audio.current.currentTime = 0;
        audio.current.src = "";
        audio.current.volume = 1;
    }
    const contentRendered = (
        <>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" minWidth="180px" width="30%" height={{ height: "56px" }}>
                {currentSong !== -1 &&
                    <>
                        <Box marginX={2} lineHeight="1.6" maxHeight="100%">
                            <Stack direction="column">
                                <Link to={`/album/${songList[currentSong].album_id}`} style={{ textDecoration: "none", color: "white", fontWeight: "bold" }}>{songList[currentSong].name}</Link>
                                <Link to={`/artist/${songList[currentSong].artist_id}`} style={{ textDecoration: "none", color: "white", fontSize: "0.6875rem" }}>{songList[currentSong].artist_name}</Link>
                            </Stack>
                        </Box>
                        <LikeButton song_id={songList[currentSong].song_id} />
                    </>
                }
            </Stack>
            <Stack direction="column" alignItems="center" justifyContent="center" maxWidth="722px" width="40%">
                <Stack direction="row" marginBottom="8px">
                    <Stack direction="row" justifyContent="flex-end">
                        <IconButton onClick={handleRandomChange}><ShuffleIcon color={random ? "success" : "inherit"} /></IconButton>
                        <IconButton onClick={handleSkipPrevious}><SkipPreviousIcon /></IconButton>
                    </Stack>
                    <IconButton onClick={toggleAudio}>
                        {playing ? <PauseCircleIcon /> : <PlayCircleIcon />}
                    </IconButton>
                    <Stack direction="row" justifyContent="flex-start">
                        <IconButton onClick={handleSkipNext}><SkipNextIcon /></IconButton>
                        <IconButton onClick={handleRepeatChange}>
                            {repeat === 0 ? <RepeatIcon /> : (repeat === 1 ? <RepeatIcon color="success" /> : <RepeatOneIcon color="success" />)}
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack direction="row" width="100%" alignItems="center" gap={2}>
                    <Typography textAlign="right" minWidth="40px" fontWeight="bold" fontSize="0.6785rem">{currentSong === -1 ? "0:00" : convertToMinuteAndSecond(currentTime)}</Typography>
                    <Slider value={currentTime} onChange={handleTimeChange} />
                    <Typography textAlign="left" minWidth="40px" fontWeight="bold" fontSize="0.6785rem">{currentSong === -1 ? "0:00": convertToMinuteAndSecond(songList[currentSong].length)}</Typography>
                </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" minWidth="180px" width="30%">
                <Stack direction="row" width="100%" alignItems="center">
                    <IconButton onClick={() => handleMuteChange(mute)}>
                        {mute ? <VolumeMuteIcon /> : <VolumeUpIcon />}
                    </IconButton>
                    <Slider size="small" value={stateVolume} onChange={handleVolumeChange} />
                </Stack>
            </Stack>
        </>
    );
    return (
        <Paper sx={{ position: "fixed", zIndex: "4", bottom: 0, left: 0, right: 0, height: "90px" }}>
            <audio ref={audio} onTimeUpdate={
                (e: SyntheticEvent<HTMLAudioElement>) => {
                    setCurrentTime((e.currentTarget.currentTime) / dur * 100);
                }
            }
                onEnded={handleEndOfSong}
            />
            <Box height="90px">
                <Stack direction="row" paddingX={2} height="100%" alignItems="center">
                    {contentRendered}
                </Stack>
            </Box>
        </Paper>
    );
}

export default MusicPlayer;