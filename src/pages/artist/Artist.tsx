import {
  Grid,
  Box,
  Stack,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  Paper,
  TableCell,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Nav from "../../components/Nav";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Avatar from "@mui/material/Avatar";
import LikeButton from "../../components/LikeButton";
import { useEffect, useState } from "react";
import { SongExpandResponse } from "../../models/SongResponse";
import { getSongsByArtist } from "../../services/songs";
import { ArtistResponse } from "../../models/ArtistResponse";
import { getSingleArtist } from "../../services/artists";
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

const About = ({ artist }: { artist: ArtistResponse }) => {
  return (
    <Paper elevation={1}>
      <Stack direction="row" padding={5} alignItems="center" spacing={4}>
        <Avatar
          src={artist.coverImg}
          alt=""
          sx={{ height: "100%", width: "204px" }}
        />
        <Typography color="#b3b3b3" fontSize="1rem">
          {artist.description}
        </Typography>
      </Stack>
    </Paper>
  );
};

const styleRow = {
  "&:hover": {
    bgcolor: "hsla(0,0%,100%,.1)",
  },
};

const Artist = () => {
  const { artistId } = useParams();
  const dispatch = useAppDispatch();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([] as SongExpandResponse[]);
  const songList = useAppSelector(selectSongList);
  const playing = useAppSelector(selectPlaying);
  const currentSong = useAppSelector(selectCurrentSong);
  useEffect(() => {
    getSingleArtist(Number(artistId)).then((res) => {
      setArtist(res.data.artists[0]);
    });
    getSongsByArtist(Number(artistId)).then((res) => {
      setSongs(res.data.songs);
    });
  }, [artistId, dispatch]);
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
  let renderedArtist = null;
  if (artist) {
    renderedArtist = artist as ArtistResponse;
  }
  let contentRendered = <Typography>Not found specific artist</Typography>;
  if (artist && renderedArtist) {
    let renderedSongs = songs.map((song: SongExpandResponse, index) => {
      const { song_id, name, length } = song;
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
        const { song_id, name, length } = song;
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
              <Avatar
                src={renderedArtist.coverImg}
                alt=""
                sx={{ height: "100%", width: "auto" }}
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
                  md: "4.5rem",
                  lg: "6rem",
                  xl: "6rem",
                }}
                fontWeight="bold"
              >
                {renderedArtist.name}
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
              alignItems="center"
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
              {/* <Button variant="outlined" color="inherit" style={{ height: "32px" }}>
                                Follow
                            </Button> */}
            </Stack>
          </Box>
          <Box>
            <Box paddingX={4}>
              <TableContainer>
                <Table>
                  <TableBody>{renderedSongs}</TableBody>
                </Table>
              </TableContainer>
              <Typography fontSize="1.5rem">About</Typography>
              <About artist={renderedArtist} />
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

export default Artist;
