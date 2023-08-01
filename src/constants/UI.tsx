import { createTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FavoriteIcon from "@mui/icons-material/Favorite";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default darkTheme;

export const FIRST_NAV = [
  {
    name: "Home",
    link: "/",
    icon: {
      current: <HomeIcon />,
      notCurrent: <HomeOutlinedIcon />,
    },
  },
  {
    name: "Search",
    link: "/search",
    icon: {
      current: <SearchIcon />,
      notCurrent: <SearchOffIcon />,
    },
  },
  {
    name: "Your Library",
    link: "/library",
    icon: {
      current: <LibraryMusicIcon />,
      notCurrent: <LibraryMusicOutlinedIcon />,
    },
  },
];

export const SECOND_NAV = [
  // {
  //   name: "Create Playlist",
  //   link: "/developing",
  //   icon: <AddBoxIcon />,
  // },
  {
    name: "Liked Songs",
    link: "/collection/tracks",
    icon: <FavoriteIcon />,
  },
];

export const MAX_CARD_COUNT = 5;
export const MAX_SONGS_COUNT = 4;
