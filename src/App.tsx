import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getUserFromLocalStorage } from "./utils/getUserFromStorage";
import { useAppDispatch } from "./app/hooks";
import { load } from "./features/auth/authSlice";
import darkTheme from "./constants/UI";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Login from "./pages/login/Login";
import Album from "./pages/album/Album";
import Artist from "./pages/artist/Artist";
import SignUp from "./pages/signup/SignUp";
import Playlist from "./pages/playlist/Playlist";
import MusicPlayer from "./components/MusicPlayer";
import React from "react";
import LikedSong from "./pages/likedSong/LikedSong";
import Developing from "./pages/developing/Developing";
import PlaylistSection from "./pages/section/PlaylistSection";
import AlbumSection from "./pages/section/AlbumSection";
import ArtistSection from "./pages/section/ArtistSection";
import Library from "./pages/library/Library";
function App() {
  const dispatch = useAppDispatch();
  const user = getUserFromLocalStorage();
  if (user !== null) {
    dispatch(load(user));
  }
  const isLoggedIn = user !== null;
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <React.Fragment>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <MusicPlayer />
                    <Home />
                  </div>
                }
              />
              <Route
                path="/search"
                element={
                  <div>
                    <MusicPlayer />
                    <Search />
                  </div>
                }
              />
              <Route
                path="/playlist/:playlistId"
                element={
                  <div>
                    <MusicPlayer />
                    <Playlist />
                  </div>
                }
              />
              <Route
                path="/album/:albumId"
                element={
                  <div>
                    <MusicPlayer />
                    <Album />
                  </div>
                }
              />
              <Route
                path="/library"
                element={
                  <div>
                    <MusicPlayer />
                    <Library />
                  </div>
                }
              />
              <Route
                path="/artist/:artistId"
                element={
                  <div>
                    <MusicPlayer />
                    <Artist />
                  </div>
                }
              />
              <Route
                path="/collection/tracks"
                element={
                  <div>
                    <MusicPlayer />
                    <LikedSong />
                  </div>
                }
              />
              <Route
                path="/developing"
                element={
                  <div>
                    <MusicPlayer />
                    <Developing />
                  </div>
                }
              />
              <Route
                path="/search"
                element={
                  <div>
                    <MusicPlayer />
                    <Search />
                  </div>
                }
              />
              <Route
                path="/section/playlist"
                element={
                  <div>
                    <MusicPlayer />
                    <PlaylistSection />
                  </div>
                }
              />
              <Route
                path="/section/album"
                element={
                  <div>
                    <MusicPlayer />
                    <AlbumSection />
                  </div>
                }
              />
              <Route
                path="/section/artist"
                element={
                  <div>
                    <MusicPlayer />
                    <ArtistSection />
                  </div>
                }
              />
              {!isLoggedIn && <Route path="/login" element={<Login />} />}
              {!isLoggedIn && <Route path="/signup" element={<SignUp />} />}
            </Routes>
          </BrowserRouter>
        </React.Fragment>
      </ThemeProvider>
    </div>
  );
}

export default App;
