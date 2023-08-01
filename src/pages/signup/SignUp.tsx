import { Stack, Typography, TextField, Button, Modal, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/spotify-logo.png";
import { ChangeEvent, useState } from "react";
import { registerToSpotify } from "../../services/auth";

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

const styleSignUp = {
    textDecoration: "none",
}

const SignUp = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setName] = useState("");
    const [errorEmail, setErrorMail] = useState("");
    const [errorConfirmEmail, setErrorConfirmEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorName, setErrorName] = useState("");
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length === 0) {
            setErrorMail("You need to enter your email.");
        } else {
            setErrorMail("");
        }
        setEmail(value);
    }
    const handleConfirmEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length === 0) {
            setErrorConfirmEmail("You need to confirm your email.");
        } else if (value !== email) {
            setErrorConfirmEmail("The email addresses don't match.");
        } else {
            setErrorConfirmEmail("");
        }
        setConfirmEmail(value);
    }
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length === 0) {
            setErrorPassword("Your need to enter a password.");
        } else if (value.length < 8) {
            setErrorPassword("Your password is too short.");
        } else {
            setErrorPassword("");
        }
        setPassword(value);
    }
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length === 0) {
            setErrorName("Enter a name for your profile.");
        } else {
            setErrorName("");
        }
        setName(value);
    }
    const handleCloseModal = () => {
        setOpen(false);
        navigate(`/login`);
    }
    const signUp = async ({ email, password, username }: { email: string, password: string, username: string }) => {
        return await registerToSpotify({ username, email, password });
    }
    const handleSignUp = () => {
        signUp({ email, password, username }).then((res) => {
            if (res.data.accounts !== null) {
                setOpen(true);
            }
        });
    }
    return (
        <Stack spacing={2} alignItems="center">
            <Stack height="68px" width="100%" justifyContent="center" alignItems="center" spacing={2}>
                <img src={logo} alt="logo" width={131} />
            </Stack>
            <Stack border="solid 1px lightgray" width="100%" />
            <Stack alignItems="center" width="480px" spacing={2}>
                <Typography variant="h4" textAlign="center"><b>Sign up for free to start listening.</b></Typography>
                <Stack width="480px" spacing={2}>
                    <Typography><b>What's your email?</b></Typography>
                    <TextField error={errorEmail.length > 0} type="email" required fullWidth placeholder="Enter your email." onChange={handleEmailChange} helperText={errorEmail.length > 0 ? errorEmail : ""} />
                    <Typography><b>Confirm your email</b></Typography>
                    <TextField error={errorConfirmEmail.length > 0} type="email" required fullWidth placeholder="Enter your email again." onChange={handleConfirmEmailChange} helperText={errorConfirmEmail.length > 0 ? errorConfirmEmail : ""} />
                    <Typography><b>Create a password</b></Typography>
                    <TextField error={errorPassword.length > 0} type="password" required fullWidth placeholder="Create a password." onChange={handlePasswordChange} helperText={errorPassword.length > 0 ? errorPassword : ""} />
                    <Typography><b>What should we call you?</b></Typography>
                    <TextField error={errorName.length > 0} required fullWidth placeholder="Enter a profile name." onChange={handleNameChange} helperText={errorName.length > 0 ? errorName : "This appears on your profile."} />
                    <Stack alignItems="center" spacing={2}>
                        <Button disabled={
                            !(email.length > 0 && confirmEmail.length > 0 && password.length >= 8 && username.length > 0) 
                        } variant="contained" size="large" color="success" onClick={handleSignUp}>Sign up</Button>
                        <Typography>
                            Have an account?
                            &nbsp;
                            <Link to="/login" style={styleSignUp}>Log in</Link>
                        </Typography>
                        <Modal
                            open={open}
                            onClose={handleCloseModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={styleModal}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Sign up successfully!
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Please login with your account
                                </Typography>
                            </Box>
                        </Modal>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default SignUp;