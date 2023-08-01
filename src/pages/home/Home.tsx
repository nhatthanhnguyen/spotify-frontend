import { Box, Grid, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { PlaylistResponse } from "../../models/PlaylistResponse";
import defaultImage from "../../assets/default-image-white.png";
import "./Home.css";
import { useEffect, useState } from "react";
import { getAllPlaylist } from "../../services/playlists";
import { getAlbumsInfo } from "../../services/albums";
import { getAllArtist } from "../../services/artists";
import { AlbumExpandResponse } from "../../models/AlbumResponse";
import { ArtistResponse } from "../../models/ArtistResponse";
import TopBar from "../../components/TopBar";
import { MAX_CARD_COUNT } from "../../constants/UI";
import Image from "../../components/Image";

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

export const Card = ({
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
          <Image
            src={imgSrc.length > 0 ? imgSrc : defaultImage}
            style={styleImgCard}
          />
        </div>
        <b style={{ color: "white" }}>{title}</b>
        <div className="clamp">{description}</div>
      </div>
    </Button>
  );
};

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([] as AlbumExpandResponse[]);
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    getAllPlaylist().then((res) => {
      setPlaylists(res.data.play_lists);
    });
    getAlbumsInfo().then((res) => {
      console.log(res);
      setAlbums(res);
    });
    getAllArtist().then((res) => {
      setArtists(res.data.artists);
    });
  }, []);
  const renderedContent = (
    <>
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
        {playlists.length > 5 ? (
          <Grid item>
            <Link
              to={`/section/playlist`}
              style={{
                textDecoration: "none",
                fontSize: "0.75rem",
                color: "white",
              }}
            >
              SHOW ALL
            </Link>
          </Grid>
        ) : undefined}
      </Grid>
      <Grid
        sx={{ pb: 2 }}
        container
        columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }}
        spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
      >
        {playlists
          .slice(0, Math.min(MAX_CARD_COUNT, playlists.length))
          .map((playlist: PlaylistResponse) => (
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
        {albums.length > 5 ? (
          <Grid item>
            <Link
              to={`/section/album`}
              style={{
                textDecoration: "none",
                fontSize: "0.75rem",
                color: "white",
              }}
            >
              SHOW ALL
            </Link>
          </Grid>
        ) : undefined}
      </Grid>
      <Grid
        sx={{ pb: 2 }}
        container
        columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }}
        spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
      >
        {albums
          .slice(0, Math.min(MAX_CARD_COUNT, albums.length))
          .map((album: AlbumExpandResponse) => (
            <Grid item key={album.album_id} xs={1} sm={1} md={1} lg={1} xl={1}>
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
        {artists.length > 5 ? (
          <Grid item>
            <Link
              to={`/section/artist`}
              style={{
                textDecoration: "none",
                fontSize: "0.75rem",
                color: "white",
              }}
            >
              SHOW ALL
            </Link>
          </Grid>
        ) : undefined}
      </Grid>
      <Grid
        sx={{ pb: 2 }}
        container
        columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }}
        spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}
      >
        {artists
          .slice(0, Math.min(MAX_CARD_COUNT, artists.length))
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
  );
  return (
    <Grid direction="row" container height="100%">
      <Grid position="fixed" width="203px" height="100%">
        <Nav currentPage="Home" />
      </Grid>
      <Grid marginLeft="203px" height="100%" width="100%">
        <TopBar />
        <Box sx={{ px: 4, pt: 3 }}>{renderedContent}</Box>
        <Box height="120px" width="100%" />
      </Grid>
    </Grid>
  );
};

export default Home;
