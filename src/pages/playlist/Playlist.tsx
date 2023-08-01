import {
  Grid,
  Box,
  Stack,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Nav from "../../components/Nav";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import LikeButton from "../../components/LikeButton";
import { useEffect, useState } from "react";
import { PlaylistResponse } from "../../models/PlaylistResponse";
import { SongExpandResponse } from "../../models/SongResponse";
import { getSongsInfoOfPlaylist } from "../../services/songs";
import { getSinglePlaylist } from "../../services/playlists";
import { convertToMinuteAndSecond } from "../../utils/convert";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentSong,
  selectPlaying,
  selectSongList,
  setCurrentSong,
  setSongList,
  togglePlaying,
} from "../../features/player/playerSlice";
import TopBar from "../../components/TopBar";
import { isCurrentPlaylist } from "../../utils/isCurrentPlaylist";

const styleRow = {
  "&:hover": {
    bgcolor: "hsla(0,0%,100%,.1)",
  },
};

const Playlist = () => {
  const { playlistId } = useParams();
  const dispatch = useAppDispatch();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([] as SongExpandResponse[]);
  const songList = useAppSelector(selectSongList);
  const playing = useAppSelector(selectPlaying);
  const currentSong = useAppSelector(selectCurrentSong);
  useEffect(() => {
    getSinglePlaylist(Number(playlistId)).then((res) => {
      setPlaylist(res.data.play_lists[0]);
    });
    getSongsInfoOfPlaylist(Number(playlistId)).then((resSongs) => {
      setSongs(resSongs);
    });
  }, [playlistId]);
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
  const togglePlayPlaylistButton = () => {
    if (!isTrue) {
      dispatch(setSongList(songs));
      dispatch(togglePlaying(false));
      dispatch(setCurrentSong(0));
    } else {
      dispatch(togglePlaying(playing));
    }
  };
  const isTrue = isCurrentPlaylist(songs, songList);
  let renderedPlaylist = null;
  if (playlist) {
    renderedPlaylist = playlist as PlaylistResponse;
  }
  let contentRendered = (
    <Typography fontWeight="bold" fontSize="1.5rem">
      Not Found Specific Playlist
    </Typography>
  );
  if (playlist && renderedPlaylist) {
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
    if (isTrue) {
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
    }
    contentRendered = (
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
                src={renderedPlaylist.cover_img}
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
                  md: "4.5rem",
                  lg: "6rem",
                  xl: "6rem",
                }}
                fontWeight="bold"
              >
                {renderedPlaylist.name}
              </Typography>
              <Typography color="white" fontSize="0.875rem">
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
                onClick={togglePlayPlaylistButton}
              >
                {playing && isTrue ? (
                  <PauseCircleIcon style={{ height: "56px", width: "56px" }} />
                ) : (
                  <PlayCircleIcon style={{ height: "56px", width: "56px" }} />
                )}
              </IconButton>
              <IconButton style={{ height: "56px", width: "56px" }}>
                <FavoriteBorderIcon style={{ height: "56px", width: "56px" }} />
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
  }
  return (
    <Grid direction="row" container height="100%">
      <Grid position="fixed" width="203px" height="100%">
        <Nav currentPage="" />
      </Grid>
      <Grid marginLeft="203px" height="100%" width="100%">
        <TopBar />
        <Box>{contentRendered}</Box>
      </Grid>
    </Grid>
  );
};

export default Playlist;
