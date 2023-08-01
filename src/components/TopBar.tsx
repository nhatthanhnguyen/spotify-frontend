import { Button, Menu, MenuItem, AppBar, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectUser } from "../features/auth/authSlice";
import { resetState } from "../features/player/playerSlice";
import { useState, MouseEvent } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const styleAppBar = {
    height: "64px",
    backgroundImage: "linear-gradient(#101010, #0f0f0f)",
    justifyContent: "center",
    position: "sticky",
}

const styleButtonLogin = {
    bgcolor: "white",
    borderRadius: "500px",
    "&:hover": {
        backgroundColor: "white",
        transform: "scale(1.05)"
    }
}

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
        transform: "scale(1.05)"
    }
}

const styleTextSignup = {
    color: "white",
    textTransform: "none",
    fontWeight: "bold",
}

const styleButtonUser = {
    bgcolor: "black",
    color: "white",
    borderRadius: "500px",
    "&:hover": {
        bgcolor: "black",
    }
}

const TopBar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const user = useAppSelector(selectUser);
    const handleClickUser = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseUser = (wantLogout: boolean) => {
        setAnchorEl(null);
        if (wantLogout) {
            dispatch(logout());
            dispatch(resetState());
            navigate("/");
        }
    }
    const isLoggedIn = user.username.length > 0;
    const open = Boolean(anchorEl);
    let renderedUserButton = null;
    if (isLoggedIn) {
        renderedUserButton = (
            <div>
                <Button sx={styleButtonUser} startIcon={<AccountCircleIcon />} endIcon={<ExpandMoreIcon />} onClick={handleClickUser}>
                    {user.username}
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={() => handleCloseUser(false)}>
                    <MenuItem onClick={() => handleCloseUser(false)}>Profile</MenuItem>
                    <MenuItem onClick={() => handleCloseUser(true)}>Logout</MenuItem>
                </Menu>
            </div>
        );
    }
    return (
        <AppBar sx={styleAppBar}>
            <Stack direction="row" paddingX={4} paddingY={2} justifyContent="flex-end" alignItems="center">
                {isLoggedIn ? renderedUserButton : (
                    <div>
                        <Button onClick={() => {navigate(`/signup`)}} sx={styleButtonSignup}>
                            <Typography sx={styleTextSignup}>Sign up</Typography>
                        </Button>
                        &nbsp;
                        <Button onClick={() => {navigate(`/login`)}} sx={styleButtonLogin}>
                            <Typography sx={styleTextLogin}>Log in</Typography>
                        </Button>
                    </div>
                )}
            </Stack>
        </AppBar>
    );
}

export default TopBar;