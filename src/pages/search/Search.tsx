import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, MouseEvent, ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, logout } from "../../features/auth/authSlice";
import {
  resetState,
  selectCurrentSong,
  selectPlaying,
  selectSongList,
  setCurrentSong,
  setSongList,
  togglePlaying,
} from "../../features/player/playerSlice";
import { search, searchByAudio } from "../../services/search";
import { SongExpandResponse } from "../../models/SongResponse";
import { ArtistResponse } from "../../models/ArtistResponse";
import { PlaylistExpandResponse } from "../../models/PlaylistResponse";
import { AlbumExpandResponse } from "../../models/AlbumResponse";
import { convertToMinuteAndSecond } from "../../utils/convert";
import { MAX_CARD_COUNT, MAX_SONGS_COUNT } from "../../constants/UI";
import Nav from "../../components/Nav";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LikeButton from "../../components/LikeButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ClearIcon from "@mui/icons-material/Clear";
import OutlinedInput from "@mui/material/OutlinedInput";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useReactMediaRecorder } from "react-media-recorder";
import "./Search.css";
import { getSongInfoById } from "../../services/songs";
import { isCurrentPlaylist } from "../../utils/isCurrentPlaylist";

const styleShowAll = {
  "&:hover": {
    cursor: "pointer",
  },
};

const styleAppBar = {
  height: "64px",
  backgroundImage: "linear-gradient(#101010, #0f0f0f)",
  justifyContent: "center",
  position: "sticky",
};

const styleButtonLogin = {
  bgcolor: "white",
  borderRadius: "500px",
  "&:hover": {
    backgroundColor: "white",
    transform: "scale(1.05)",
  },
};

const styleTextLogin = {
  color: "black",
  textTransform: "none",
  fontWeight: "bold",
  px: 4,
  py: 1,
};

const styleButtonSignup = {
  bgcolor: "#0f0f0f",
  "&:hover": {
    bgcolor: "#0f0f0f",
    transform: "scale(1.05)",
  },
};

const styleTextSignup = {
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
};

const styleButtonUser = {
  bgcolor: "black",
  color: "white",
  borderRadius: "500px",
  "&:hover": {
    bgcolor: "black",
  },
};

const styleImgCard = {
  width: "100%",
  aspectRatio: "1 / 1",
};

const styleCard = {
  textTransform: "none",
  bgcolor: "#181818",
  color: "#b3b3b3",
  "&:hover": {
    bgcolor: "hsla(0, 0%, 100%, .1)",
    textDecoration: "none",
  },
};

const styleRow = {
  "&:hover": {
    bgcolor: "hsla(0,0%,100%,.1)",
  },
};

const styleModal = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Card = ({
  id,
  imgSrc,
  title,
  description,
  link,
}: {
  id: number;
  imgSrc: string;
  title: string;
  description: string;
  link: string;
}) => {
  const navigate = useNavigate();
  const handleClickCard = () => {
    navigate(`${link}/${id}`);
  };
  return (
    <Button
      sx={styleCard}
      variant="contained"
      fullWidth
      onClick={handleClickCard}
    >
      <div style={{ textAlign: "left" }}>
        <div>
          <img src={imgSrc} alt="" style={styleImgCard} />
        </div>
        <b className="clamp-title" style={{ color: "white" }}>
          {title}
        </b>
        <div className="clamp-description">{description}</div>
      </div>
    </Button>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState("");
  const [songs, setSongs] = useState([] as SongExpandResponse[]);
  const [artists, setArtists] = useState([] as ArtistResponse[]);
  const [playlists, setPlaylists] = useState([] as PlaylistExpandResponse[]);
  const [albums, setAlbums] = useState([] as AlbumExpandResponse[]);
  const [value, setValue] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openNotFoundModal, setOpenNotFoundModal] = useState(false);
  const songList = useAppSelector(selectSongList);
  const user = useAppSelector(selectUser);
  const playing = useAppSelector(selectPlaying);
  const currentSong = useAppSelector(selectCurrentSong);
  const handleCloseNotFoundModal = () => setOpenNotFoundModal(false);
  const handleClickUser = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop(blobUrl, blob) {
      setIsActive(false);
      if (blob.size <= 21000) {
        setErrorMessage("Your audio record must be more 3 seconds");
        setSeconds(0);
      } else {
        setSeconds(0);
        setOpenModal(false);
        const audioFile = new File([blob], "audio.wav", { type: "audio/wav" });
        searchByAudio(audioFile).then((res) => {
          const index = parseInt(res.data);
          if (index === -1) {
            setOpenNotFoundModal(true);
            setSongs([]);
          } else {
            getSongInfoById(index).then((res: SongExpandResponse[]) => {
              setSongs(res);
            });
          }
        });
      }
    },
    onStart() {
      setIsActive(true);
      setErrorMessage("");
    },
  });
  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      if (seconds === 15) {
        setIsRecord(false);
        stopRecording();
      } else {
        timer = setInterval(() => {
          setSeconds((seconds) => seconds + 1);
        }, 1000);
      }
    }
    return () => {
      clearInterval(timer);
    };
  }, [isActive, seconds, stopRecording]);
  const handlePlayButton = (index: number) => {
    if (currentSong === index) {
      if (isCurrentPlaylist(songs, songList)) {
        dispatch(togglePlaying(playing));
      } else {
        if (playing === true) dispatch(setCurrentSong(index));
        else {
          dispatch(setSongList(songs));
          dispatch(togglePlaying(playing));
          dispatch(setCurrentSong(index));
        }
      }
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
  const handleCloseUser = (wantLogout: boolean) => {
    setAnchorEl(null);
    if (wantLogout) {
      dispatch(logout());
      dispatch(resetState());
      navigate("/");
    }
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    if (keyword.length > 0) {
      search(keyword).then(
        (
          res: (
            | SongExpandResponse[]
            | AlbumExpandResponse[]
            | ArtistResponse[]
            | PlaylistExpandResponse[]
          )[]
        ) => {
          setSongs(res[0] as SongExpandResponse[]);
          setAlbums(res[1] as AlbumExpandResponse[]);
          setArtists(res[2] as ArtistResponse[]);
          setPlaylists(res[3] as PlaylistExpandResponse[]);
        }
      );
    }
    setInput(keyword);
  };
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    stopRecording();
    setErrorMessage("");
    setIsRecord(false);
    setIsActive(false);
    setSeconds(0);
    setOpenModal(false);
  };
  const handleToggleRecord = (prevState: boolean) => {
    if (prevState) {
      setIsRecord(false);
      stopRecording();
    } else {
      setIsRecord(true);
      startRecording();
    }
  };
  const isLoggedIn = user.username.length > 0;
  const open = Boolean(anchorEl);
  let results: string[] = [];
  if (input.length > 0) {
    if (artists.length > 0) results.push("Artists");
    if (songs.length > 0) results.push("Songs");
    if (playlists.length > 0) results.push("Playlists");
    if (albums.length > 0) results.push("Albums");
  } else {
    if (songs.length > 0) results.push("Songs");
  }
  const renderedSearchField = (
    <OutlinedInput
      size="small"
      placeholder="What do you want to listen to?"
      onChange={handleInputChange}
      value={input}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        <>
          {input.length > 0 ? (
            <IconButton
              onClick={() => {
                setInput("");
              }}
            >
              <ClearIcon />
            </IconButton>
          ) : undefined}
          <InputAdornment position="end">
            <IconButton onClick={handleOpenModal}>
              <MicIcon />
            </IconButton>
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box sx={styleModal}>
                <Typography variant="h6" component="h2">
                  Record audio to search your songs
                </Typography>
                <Stack
                  paddingTop={2}
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconButton
                    size="large"
                    sx={{ padding: 0 }}
                    onClick={() => handleToggleRecord(isRecord)}
                  >
                    {isRecord ? <StopCircleIcon /> : <PlayCircleIcon />}
                  </IconButton>
                  <Typography variant="h6">{seconds}s</Typography>
                </Stack>
                <Typography>{errorMessage}</Typography>
              </Box>
            </Modal>
          </InputAdornment>
        </>
      }
    />
  );
  let renderedUserButton = null;
  if (isLoggedIn) {
    renderedUserButton = (
      <div>
        <Button
          sx={styleButtonUser}
          startIcon={<AccountCircleIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={handleClickUser}
        >
          {user.username}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseUser}>
          <MenuItem
            href={`/user/${user.code}`}
            onClick={() => handleCloseUser(false)}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleCloseUser(true)}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
  const renderedUserSearch = (
    <Stack
      height="calc(100vh - 90px - 64px)"
      alignItems="center"
      justifyContent="center"
    >
      <Typography fontSize="1.5rem" fontWeight="bold">
        Type on box "What do you want to listen" to search
      </Typography>
    </Stack>
  );
  const renderedNotFoundResults = (
    <Stack
      height="calc(100vh - 90px - 64px)"
      alignItems="center"
      justifyContent="center"
    >
      <Typography fontSize="1.5rem" fontWeight="bold">
        No results found for "{input}"
      </Typography>
    </Stack>
  );
  const renderedTopbar = (
    <AppBar sx={styleAppBar}>
      <Stack
        direction="row"
        paddingX={4}
        paddingY={2}
        justifyContent="space-between"
        alignItems="center"
      >
        {renderedSearchField}
        {isLoggedIn ? (
          renderedUserButton
        ) : (
          <div>
            <Button
              onClick={() => {
                navigate(`/signup`);
              }}
              sx={styleButtonSignup}
            >
              <Typography sx={styleTextSignup}>Sign up</Typography>
            </Button>
            &nbsp;
            <Button
              onClick={() => {
                navigate(`/login`);
              }}
              sx={styleButtonLogin}
            >
              <Typography sx={styleTextLogin}>Log in</Typography>
            </Button>
          </div>
        )}
      </Stack>
    </AppBar>
  );
  const renderedSongs = songs
    .slice(
      0,
      value === 0 ? Math.min(MAX_SONGS_COUNT, songs.length) : songs.length
    )
    .map((song: SongExpandResponse, index) => {
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
  const renderedTableSongs = (
    <>
      {songs.length > 0 ? (
        <>
          {value === 0 ? (
            <Grid
              sx={{ pb: 2 }}
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
            >
              <Grid item>
                <Typography fontSize="1.5rem">Songs</Typography>
              </Grid>
              {songs.length > MAX_SONGS_COUNT ? (
                <Grid item>
                  <Typography
                    sx={styleShowAll}
                    onClick={() => {
                      setValue(results.indexOf("Songs") + 1);
                    }}
                    fontSize="0.75rem"
                  >
                    SHOW ALL
                  </Typography>
                </Grid>
              ) : undefined}
            </Grid>
          ) : undefined}
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
          <Box height="20px" />
        </>
      ) : undefined}
    </>
  );
  const renderedPlaylists = (
    <>
      {playlists.length > 0 ? (
        <>
          {value === 0 ? (
            <Grid
              sx={{ pb: 2 }}
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
            >
              <Grid item>
                <Typography fontSize="1.5rem">Playlists</Typography>
              </Grid>
              {playlists.length > MAX_SONGS_COUNT ? (
                <Grid item>
                  <Typography
                    onClick={() => {
                      setValue(results.indexOf("Playlists") + 1);
                    }}
                    fontSize="0.75rem"
                  >
                    SHOW ALL
                  </Typography>
                </Grid>
              ) : undefined}
            </Grid>
          ) : undefined}
          <Grid
            sx={{ pb: 2 }}
            container
            columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }}
            spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
          >
            {playlists
              .slice(
                0,
                value === 0
                  ? Math.min(playlists.length, MAX_CARD_COUNT)
                  : playlists.length
              )
              .map((playlist: PlaylistExpandResponse) => (
                <Grid
                  item
                  key={playlist.play_list_id}
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                >
                  <Card
                    id={playlist.play_list_id}
                    imgSrc={playlist.cover_img}
                    title={playlist.name}
                    description={""}
                    link="/playlist"
                  />
                </Grid>
              ))}
          </Grid>
        </>
      ) : undefined}
    </>
  );
  const renderedAlbums = (
    <>
      {albums.length > 0 ? (
        <>
          {value === 0 ? (
            <Grid
              sx={{ pb: 2 }}
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
            >
              <Grid item>
                <Typography fontSize="1.5rem">Albums</Typography>
              </Grid>
              {albums.length > MAX_SONGS_COUNT ? (
                <Grid item>
                  <Typography
                    sx={styleShowAll}
                    onClick={() => {
                      setValue(results.indexOf("Albums") + 1);
                    }}
                    fontSize="0.75rem"
                  >
                    SHOW ALL
                  </Typography>
                </Grid>
              ) : undefined}
            </Grid>
          ) : undefined}
          <Grid
            sx={{ pb: 2 }}
            container
            columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }}
            spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
          >
            {albums
              .slice(
                0,
                value === 0
                  ? Math.min(albums.length, MAX_CARD_COUNT)
                  : albums.length
              )
              .map((album: AlbumExpandResponse) => (
                <Grid
                  item
                  key={album.album_id}
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                >
                  <Card
                    id={album.album_id}
                    imgSrc={album.cover_img}
                    title={album.name}
                    description={album.artist_name as string}
                    link="/album"
                  />
                </Grid>
              ))}
          </Grid>
        </>
      ) : undefined}
    </>
  );
  const renderedArtists = (
    <>
      {artists.length > 0 ? (
        <>
          {value === 0 ? (
            <Grid
              sx={{ pb: 2 }}
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
            >
              <Grid item>
                <Typography fontSize="1.5rem">Artists</Typography>
              </Grid>
              {artists.length > MAX_SONGS_COUNT ? (
                <Grid item>
                  <Typography
                    sx={styleShowAll}
                    onClick={() => {
                      setValue(results.indexOf("Artists") + 1);
                    }}
                    fontSize="0.75rem"
                  >
                    SHOW ALL
                  </Typography>
                </Grid>
              ) : undefined}
            </Grid>
          ) : undefined}
          <Grid
            sx={{ pb: 2 }}
            container
            columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }}
            spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
          >
            {artists
              .slice(
                0,
                value === 0
                  ? Math.min(artists.length, MAX_CARD_COUNT)
                  : artists.length
              )
              .map((artirst: ArtistResponse) => (
                <Grid
                  item
                  key={artirst.artist_id}
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                >
                  <Card
                    id={artirst.artist_id}
                    imgSrc={artirst.coverImg}
                    title={artirst.name}
                    description={"Artist"}
                    link="/artist"
                  />
                </Grid>
              ))}
          </Grid>
        </>
      ) : undefined}
    </>
  );
  const renderedContent = (
    <>
      <Tabs sx={{ paddingBottom: 2 }} value={value} onChange={handleChangeTab}>
        <Tab label="All" {...a11yProps(0)} />
        {results.map((res, index) => (
          <Tab key={index} label={res} value={index + 1} />
        ))}
      </Tabs>
      <TabPanel value={value} index={0}>
        {renderedTableSongs}
        {renderedAlbums}
        {renderedArtists}
        {renderedPlaylists}
      </TabPanel>
      {results.map((item, index) => (
        <TabPanel key={index} value={value} index={index + 1}>
          {item === "Playlists"
            ? renderedPlaylists
            : item === "Albums"
            ? renderedAlbums
            : item === "Artists"
            ? renderedArtists
            : renderedTableSongs}
        </TabPanel>
      ))}
    </>
  );
  return (
    <Grid direction="row" container height="100%">
      <Grid item position="fixed" width="203px" height="100%">
        <Nav currentPage="Search" />
      </Grid>
      <Grid item marginLeft="203px" height="100%" width="100%">
        {renderedTopbar}
        <Box sx={{ px: 4, pt: 3 }}>
          {results.length > 0
            ? renderedContent
            : input.length > 0
            ? renderedNotFoundResults
            : renderedUserSearch}
        </Box>
        <Box height="120px" width="100%" />
      </Grid>
      <Modal open={openNotFoundModal} onClose={handleCloseNotFoundModal}>
        <Box sx={styleModal}>
          <Typography variant="h6" component="h2">
            Your song does not found
          </Typography>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Search;
