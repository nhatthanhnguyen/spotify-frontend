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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PauseIcon from "@mui/icons-material/Pause";
import { useEffect, useState } from "react";
import { SongExpandResponse } from "../../models/SongResponse";
import { getSongsByAlbum } from "../../services/songs";
import { getAlbumInfo, getAlbumsUserLike } from "../../services/albums";
import { AlbumExpandResponse, AlbumResponse } from "../../models/AlbumResponse";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentSong,
  selectPlaying,
  selectSongList,
  setCurrentSong,
  setSongList,
  togglePlaying,
} from "../../features/player/playerSlice";
import { convertToMinuteAndSecond } from "../../utils/convert";
import LikeButton from "../../components/LikeButton";
import TopBar from "../../components/TopBar";
import { isCurrentPlaylist } from "../../utils/isCurrentPlaylist";
import { selectUser } from "../../features/auth/authSlice";
import { dislikeObject, likeObject } from "../../services/interactions";

const styleRow = {
  "&:hover": {
    bgcolor: "hsla(0,0%,100%,.1)",
  },
};

const Album = () => {
  const { albumId } = useParams();
  const dispatch = useAppDispatch();
  const [songs, setSongs] = useState([] as SongExpandResponse[]);
  const [album, setAlbum] = useState<AlbumExpandResponse | undefined>();
  const [albumLike, setAlbumLike] = useState<boolean>(false);
  const songList = useAppSelector(selectSongList);
  const playing = useAppSelector(selectPlaying);
  const currentSong = useAppSelector(selectCurrentSong);
  const currentUser = useAppSelector(selectUser);
  useEffect(() => {
    getAlbumInfo(Number(albumId)).then((albumRes) => {
      setAlbum(albumRes);
    });
    getSongsByAlbum(Number(albumId)).then((songRes) => {
      setSongs(songRes.data.songs);
    });
    getAlbumsUserLike(Number(currentUser.user_id)).then((albumsRes) => {
      const albums = albumsRes.data.albums as AlbumResponse[];
      for (const a of albums) {
        if (a.album_id === parseInt(albumId as string, 0)) {
          setAlbumLike(true);
        }
      }
    });
  }, [albumId, currentUser.user_id]);
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
  const toggleLikeButton = () => {
    const objectRequest = {
      user_id: currentUser.user_id,
      object_id: parseInt(albumId as string, 0),
      object_type: 2,
    };
    if (albumLike) {
      dislikeObject(objectRequest).then((res) => {
        console.log(res);
        setAlbumLike(false);
      });
    } else {
      likeObject(objectRequest).then((res) => {
        console.log(res);
        setAlbumLike(true);
      });
    }
  };
  const isTrue = isCurrentPlaylist(songs, songList);
  let renderedAlbum = null;
  if (album) {
    renderedAlbum = album as AlbumExpandResponse;
  }
  let contentRendered = <Typography>Not found specific album</Typography>;
  if (album && renderedAlbum) {
    let renderedSongs = songs.map((song, index) => {
      const { song_id, name, artist_id, artist_name, length } = song;
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
      console.log(isTrue);
      renderedSongs = songs.map((song, index) => {
        const { song_id, name, artist_id, artist_name, length } = song;
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
                src={renderedAlbum.cover_img}
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
                {renderedAlbum.name}
              </Typography>
              <Typography color="white" fontSize="0.875rem">
                <Link
                  to={`/artist/${renderedAlbum.artist_id}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {renderedAlbum.artist_name}
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
                {playing ? (
                  <PauseCircleIcon style={{ height: "56px", width: "56px" }} />
                ) : (
                  <PlayCircleIcon style={{ height: "56px", width: "56px" }} />
                )}
              </IconButton>
              <IconButton
                style={{ height: "56px", width: "56px" }}
                color="success"
                onClick={toggleLikeButton}
              >
                {albumLike ? (
                  <FavoriteIcon style={{ height: "56px", width: "56px" }} />
                ) : (
                  <FavoriteBorderIcon
                    style={{ height: "56px", width: "56px" }}
                  />
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

export default Album;
