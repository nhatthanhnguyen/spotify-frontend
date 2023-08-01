import { Grid, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import TopBar from "../../components/TopBar";
import defaultImage from "../../assets/default-image.png";
import { PlaylistResponse } from "../../models/PlaylistResponse";
import { getAllPlaylist } from "../../services/playlists";
import "./Section.css";

const styleImgCard = {
    width: "100%",
    aspectRatio: "1 / 1",
}

const styleCard = {
    textTransform: "none",
    bgcolor: "#181818",
    color: "#b3b3b3",
    "&:hover": {
        bgcolor: "hsla(0, 0%, 100%, .1)",
        textDecoration: "none",
    }
}

const Card = ({ id, imgSrc, title, description, link }: { id: number, imgSrc: string, title: string, description: string; link: string }) => {
    const navigate = useNavigate();
    const handleClickCard = () => {
        navigate(`${link}/${id}`);
    }
    return (
        <Button sx={styleCard} variant="contained" fullWidth onClick={handleClickCard}>
            <div style={{ textAlign: "left" }}>
                <div>
                    <img src={imgSrc.length > 0 ? imgSrc : defaultImage} alt="" style={styleImgCard} />
                </div>
                <b className="clamp" style={{ color: "white" }}>{title}</b>
                <div className="clamp">{description}</div>
            </div>
        </Button>
    );
}

const PlaylistSection = () => {
    const [playlists, setPlaylists] = useState([]);
    useEffect(() => {
        getAllPlaylist().then((res) => {
            setPlaylists(res.data.play_lists);
        });
    }, []);
    const renderedContent = (
        <>
            <Grid sx={{ pb: 2 }} container columns={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 9 }} spacing={{ sm: 2, md: 3, lg: 3, xl: 3 }}>
                {playlists.map((playlist: PlaylistResponse) => (
                    <Grid item key={playlist.play_list_id} xs={1} sm={1} md={1} lg={1} xl={1}>
                        <Card id={playlist.play_list_id} imgSrc={playlist.cover_img} title={playlist.name} description={""} link="/playlist" />
                    </Grid>
                ))}
            </Grid>
        </>
    )
    return (
        <Grid direction="row" container height="100%">
            <Grid position="fixed" width="203px" height="100%">
                <Nav currentPage="" />
            </Grid>
            <Grid marginLeft="203px" height="100%" width="100%">
                <TopBar />
                <Box sx={{ px: 4, pt: 3 }}>
                    {renderedContent}
                </Box>
                <Box height="120px" width="100%" />
            </Grid>
        </Grid>
    );
}

export default PlaylistSection;