import {
  Grid,
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import Nav from "../../components/Nav";
import TopBar from "../../components/TopBar";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/authSlice";
import { useState, useEffect } from "react";
import { AlbumExpandResponse } from "../../models/AlbumResponse";
import { ArtistResponse } from "../../models/ArtistResponse";
import { PlaylistExpandResponse } from "../../models/PlaylistResponse";
import { getAlbumsUserLikeInfo } from "../../services/albums";
import { getPlaylistsUserLikeInfo } from "../../services/playlists";
import { getArtistsUserLikeInfo } from "../../services/artists";
import { Link } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

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

const Library = () => {
  const user = useAppSelector(selectUser);
  const [artists, setArtists] = useState([] as ArtistResponse[]);
  const [playlists, setPlaylists] = useState([] as PlaylistExpandResponse[]);
  const [albums, setAlbums] = useState([] as AlbumExpandResponse[]);
  const [value, setValue] = useState(0);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    getAlbumsUserLikeInfo(user.user_id).then((res) => {
      setAlbums(res);
    });
    getPlaylistsUserLikeInfo(user.user_id).then((res) => {
      setPlaylists(res);
    });
    getArtistsUserLikeInfo(user.user_id).then((res) => {
      setArtists(res.data.artists ?? []);
    });
  }, [user.user_id]);
  let results: string[] = [];
  if (artists.length > 0) results.push("Artists");
  if (playlists.length > 0) results.push("Playlists");
  if (albums.length > 0) results.push("Albums");
  const renderedAlbums = (
    <>
      {albums.length === 0
        ? undefined
        : albums.map((album: AlbumExpandResponse) => (
            <Link
              to={`/album/${album.album_id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Stack direction="row" spacing="12px" padding="8px">
                <img src={album.cover_img} width="48px" height="48px" alt="" />
                <Stack direction="column">
                  <Typography fontSize={"16px"}>{album.name}</Typography>
                  <Typography
                    fontSize={"13px"}
                  >{`Album • ${album.artist_name}`}</Typography>
                </Stack>
              </Stack>
            </Link>
          ))}
    </>
  );
  const renderedArtists = (
    <>
      {artists.length === 0
        ? undefined
        : artists.map((artist: ArtistResponse) => (
            <Link
              to={`/artist/${artist.artist_id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Stack direction="row" spacing="12px" padding="8px">
                <img src={artist.coverImg} width="48px" height="48px" alt="" />
                <Stack direction="column">
                  <Typography fontSize={"16px"}>{artist.name}</Typography>
                  <Typography fontSize={"13px"}>Artist</Typography>
                </Stack>
              </Stack>
            </Link>
          ))}
    </>
  );
  const renderedPlaylists = (
    <>
      {playlists.length === 0
        ? undefined
        : playlists.map((playlist: PlaylistExpandResponse) => (
            <Link
              to={`/playlist/${playlist.play_list_id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Stack direction="row" spacing="12px" padding="8px">
                <img
                  src={playlist.cover_img}
                  width="48px"
                  height="48px"
                  alt=""
                />
                <Stack direction="column">
                  <Typography fontSize={"16px"}>{playlist.name}</Typography>
                  <Typography
                    fontSize={"13px"}
                  >{`Playlist • ${playlist.username}`}</Typography>
                </Stack>
              </Stack>
            </Link>
          ))}
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
        <Stack>{renderedAlbums}</Stack>
        <Stack>{renderedArtists}</Stack>
        <Stack>{renderedPlaylists}</Stack>
      </TabPanel>
      {results.map((item, index) => (
        <TabPanel key={index} value={value} index={index + 1}>
          {item === "Playlists"
            ? renderedPlaylists
            : item === "Albums"
            ? renderedAlbums
            : renderedArtists}
        </TabPanel>
      ))}
    </>
  );
  return (
    <Grid direction="row" container height="100%">
      <Grid position="fixed" width="203px" height="100%">
        <Nav currentPage="Your Library" />
      </Grid>
      <Grid marginLeft="203px" height="100%" width="100%">
        <TopBar />
        <Box sx={{ px: 4, pt: 3 }}>{renderedContent}</Box>
        <Box height="120px" width="100%" />
      </Grid>
    </Grid>
  );
};

export default Library;
