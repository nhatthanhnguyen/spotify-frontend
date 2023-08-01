export const getUserFromLocalStorage = () => {
    const user_id = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const code = localStorage.getItem("code");
    const role = localStorage.getItem("role");
    const status = localStorage.getItem("status");
    if (user_id && username && code && role && status)
        return { user_id: Number(user_id), username, code, role, status };
    return null;
}