import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectPlaying,
  selectCurrentSong,
  togglePlaying,
  setCurrentSong,
  setSongList,
  selectSongList,
} from "../../features/player/playerSlice";
import { SongExpandResponse } from "../../models/SongResponse";
import { getSongsInfoOfLikedSong } from "../../services/songs";
import { selectUser } from "../../features/auth/authSlice";
import {
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Stack,
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { convertToMinuteAndSecond } from "../../utils/convert";
import { Link, useNavigate } from "react-router-dom";
import {
  checkLikedSong,
  likedSong,
  unlikeSong,
} from "../../services/interactions";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Nav from "../../components/Nav";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import likedSongImg from "../../assets/liked-songs.png";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TopBar from "../../components/TopBar";
import { isCurrentPlaylist } from "../../utils/isCurrentPlaylist";

const styleRow = {
  "&:hover": {
    bgcolor: "hsla(0,0%,100%,.1)",
  },
};

const LikeButton = ({ song_id }: { song_id: number }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    checkLikedSong(user.user_id, song_id).then((res) => {
      setLiked(res);
    });
  }, [song_id, user.user_id]);
  const handleLikedButton = (prev: boolean, song_id: number) => {
    if (user.username.length > 0) {
      if (prev) {
        unlikeSong(user.user_id, song_id).then((res) => {
          setLiked(false);
          navigate(`/`);
        });
      } else {
        likedSong(user.user_id, song_id).then((res) => {
          setLiked(true);
          navigate(`/`);
        });
      }
    }
  };
  return (
    <Typography>
      <IconButton onClick={() => handleLikedButton(liked, song_id)}>
        {liked ? <FavoriteIcon color="success" /> : <FavoriteBorderIcon />}
      </IconButton>
    </Typography>
  );
};

const LikedSong = () => {
  const dispatch = useAppDispatch();
  const [songs, setSongs] = useState([] as SongExpandResponse[]);
  const songList = useAppSelector(selectSongList);
  const user = useAppSelector(selectUser);
  const playing = useAppSelector(selectPlaying);
  const currentSong = useAppSelector(selectCurrentSong);
  useEffect(() => {
    getSongsInfoOfLikedSong(user.user_id).then((res) => {
      setSongs(res);
    });
  }, [user.user_id]);
  const handlePlayButton = (index: number) => {
    if (currentSong === index) {
      dispatch(togglePlaying(playing));
    } else {
      if (playing === true) {
        dispatch(setCurrentSong(index));
      } else {
        dispatch(setSongList(songs));
        dispatch(togglePlaying(playing));
        dispatch(setCurrentSong(index));
      }
    }
  };
  const toggleBigPlayingButton = () => {
    if (!isTrue) {
      dispatch(setSongList(songs));
      dispatch(togglePlaying(false));
      dispatch(setCurrentSong(0));
    } else {
      dispatch(togglePlaying(playing));
    }
  };
  const isTrue = isCurrentPlaylist(songs, songList);
  let renderedSongs = songs.map((song: SongExpandResponse, index) => {
    const {
      song_id,
      name,
      length,
      album_id,
      artist_id,
      album_name,
      artist_name,
    } = song;
    const time = convertToMinuteAndSecond(length);
    return (
      <TableRow key={song_id} sx={styleRow}>
        <TableCell sx={{ paddingX: 0 }}>
          <IconButton onClick={() => handlePlayButton(index)}>
            <PlayArrowIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography
            fontSize="1rem"
            color={currentSong === index && playing ? "green" : "white"}
          >
            {name}
          </Typography>
          <Link
            to={`/artist/${artist_id}`}
            style={{
              fontSize: "0.875rem",
              color: "#b3b3b3",
              textDecoration: "none",
            }}
          >
            {artist_name}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`/album/${album_id}`}
            style={{
              fontSize: "0.875rem",
              color: "#b3b3b3",
              textDecoration: "none",
            }}
          >
            {album_name}
          </Link>
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={3}
          >
            <LikeButton song_id={song_id} />
            <Typography>{time}</Typography>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });
  renderedSongs = songs.map((song: SongExpandResponse, index) => {
    const {
      song_id,
      name,
      length,
      album_id,
      artist_id,
      album_name,
      artist_name,
    } = song;
    const time = convertToMinuteAndSecond(length);
    return (
      <TableRow key={song_id} sx={styleRow}>
        <TableCell sx={{ paddingX: 0 }}>
          <IconButton onClick={() => handlePlayButton(index)}>
            {currentSong === index && playing ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography
            fontSize="1rem"
            color={currentSong === index && playing ? "green" : "white"}
          >
            {name}
          </Typography>
          <Link
            to={`/artist/${artist_id}`}
            style={{
              fontSize: "0.875rem",
              color: "#b3b3b3",
              textDecoration: "none",
            }}
          >
            {artist_name}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`/album/${album_id}`}
            style={{
              fontSize: "0.875rem",
              color: "#b3b3b3",
              textDecoration: "none",
            }}
          >
            {album_name}
          </Link>
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={3}
          >
            <LikeButton song_id={song_id} />
            <Typography>{time}</Typography>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });
  const contentRendered = (
    <>
      <Stack paddingX={4} paddingBottom={3}>
        <Stack direction="row">
          <Box
            marginRight={3}
            height={{
              xs: "192px",
              sm: "192px",
              md: "192px",
              lg: "232px",
              xl: "232px",
            }}
          >
            <img
              src={likedSongImg}
              alt=""
              style={{ height: "100%", width: "auto" }}
            />
          </Box>
          <Stack
            direction="column"
            justifyContent="flex-end"
            lineHeight="25.6px"
            spacing={1}
          >
            <Typography color="white" fontSize="12px" fontWeight="bold">
              PLAYLIST
            </Typography>
            <Typography
              color="white"
              fontSize={{
                xs: "2rem",
                sm: "2rem",
                md: "3.5rem",
                lg: "4.5rem",
                xl: "6rem",
              }}
              fontWeight="bold"
            >
              Liked Songs
            </Typography>
            <Typography color="white" fontSize="0.875rem">
              <Link
                to={`/user/${user.user_id}`}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {user.username}
              </Link>
              &nbsp; &#x2022; &nbsp;
              {songs.length} songs
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Box>
        <Box height="104px">
          <Stack
            paddingX={4}
            paddingY={3}
            direction="row"
            justifyContent="flex-start"
            spacing={4}
          >
            <IconButton
              color="success"
              style={{ height: "56px", width: "56px" }}
              onClick={toggleBigPlayingButton}
            >
              {playing && isTrue ? (
                <PauseCircleIcon style={{ height: "56px", width: "56px" }} />
              ) : (
                <PlayCircleIcon style={{ height: "56px", width: "56px" }} />
              )}
            </IconButton>
          </Stack>
        </Box>
        <Box>
          <Box paddingX={4}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Typography color="#b3b3b3">#</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography color="#b3b3b3">TITLE</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography color="#b3b3b3">ALBUM</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="#b3b3b3">
                        <AccessTimeIcon />
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderedSongs}</TableBody>
              </Table>
            </TableContainer>
            <Box height="180px" />
          </Box>
        </Box>
      </Box>
    </>
  );
  return (
    <Grid direction="row" container height="100%">
      <Grid position="fixed" width="203px" height="100%">
        <Nav currentPage="Liked Songs" />
      </Grid>
      <Grid marginLeft="203px" height="100%" width="100%">
        <TopBar />
        <Box>{contentRendered}</Box>
      </Grid>
    </Grid>
  );
};

export default LikedSong;
