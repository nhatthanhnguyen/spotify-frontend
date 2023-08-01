import { IconButton } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const PlayButton = ({ style }: {style: object}) => {
    return (
        <IconButton style={style}>
            <PlayArrowIcon />
        </IconButton>
    );
}

export default PlayButton;