import axios from "axios";
import { LOGIN, REGISTER } from "../api/auth";

export const loginToSpotify = async ({username, password} : {username: string; password: string}) => {
    return await axios.post(LOGIN, {username, password});
}

export const registerToSpotify = async ({username, email, password}: {username: string; email: string; password: string}) => {
    let data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    return await axios.post(REGISTER, data);
}