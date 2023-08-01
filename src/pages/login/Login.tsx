import { Stack, Typography, TextField, Button, Modal, Box } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import logo from "../../assets/spotify-logo.png";
import { loginSpotify } from "../../features/auth/authSlice";
import { loginToSpotify } from "../../services/auth";

const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        let currentUsername = event.target.value;
        if (currentUsername.length === 0) {
            setUsernameError(true);
        } else {
            setUsernameError(false);
        }
        setUsername(currentUsername);
    }
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        let currentPassword = event.target.value;
        if (currentPassword.length === 0) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
        setPassword(currentPassword);
    }
    const login = async ({username, password} : {username: string; password: string}) => {
        return await loginToSpotify({username, password});
    }
    const handleLogin = () => {
        login({username, password}).then((res) => {
            dispatch(loginSpotify({username, password}));
            navigate(`/`);
        }).catch((res) => {
            setOpen(true);
        })
    }
    const handleClose = () => setOpen(false);
    const canPressed = (username !== null && username.length > 0) && (password !== null && password.length > 0);
    return (
        <Stack spacing={2} alignItems="center">
            <Stack height="68px" width="100%" justifyContent="center" alignItems="center" spacing={2}>
                <img src={logo} alt="logo" width={131} />
            </Stack>
            <Stack border="solid 1px lightgray" width="100%"/>
            <Stack alignItems="center" width="480px" spacing={2}>
                <Typography><b>To continue, log in to Spotify</b></Typography>
                <Stack width="480px" spacing={2}>
                    <Typography><b>Username</b></Typography>
                    <TextField error={usernameError} helperText={usernameError ? "Please fill in your username" : undefined} required fullWidth placeholder="Your username" onChange={handleUsernameChange} />
                    <Typography><b>Password</b></Typography>
                    <TextField error={passwordError} helperText={passwordError ? "Please fill in your password" : undefined} type="password" required fullWidth placeholder="Your password" onChange={handlePasswordChange}/>
                    <Stack alignItems="flex-end">
                        <Button variant="contained" size="large" onClick={handleLogin} disabled={!canPressed}>Log in</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={styleModal}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Incorrect login information
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Please check your username or password!
                                </Typography>
                            </Box>
                        </Modal>
                    </Stack>
                </Stack>
            </Stack>
            <Stack border="solid 1px lightgray" width="480px"></Stack>
            <Stack alignItems="center" width="480px" spacing={2}>
                <Typography><b>Don't have an account?</b></Typography>
                <Button href="/signup" variant="outlined" fullWidth size="large">Sign up for spotify</Button>
            </Stack>
        </Stack>
    );
}

export default Login;