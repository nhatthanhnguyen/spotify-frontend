import { Typography, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/auth/authSlice";
import {
  checkLikedSong,
  unlikeSong,
  likedSong,
} from "../services/interactions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const LikeButton = ({ song_id }: { song_id: number }) => {
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
        });
      } else {
        likedSong(user.user_id, song_id).then((res) => {
          setLiked(true);
        });
      }
    }
  };
  return (
    <Typography>
      <IconButton
        color="success"
        onClick={() => handleLikedButton(liked, song_id)}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Typography>
  );
};

export default LikeButton;
