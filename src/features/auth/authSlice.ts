import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { userLogin } from "../../models/userLogin";
import { loginToSpotify } from "../../services/auth";

const initialState = {
    account: {
        user_id: 0,
        username: "",
        code: "",
        role: "",
        status: "",
    },
    error: null,
} as userLogin;

export const loginSpotify = createAsyncThunk("auth/login", async ({ username, password }: { username: string, password: string }) => {
    const response = await loginToSpotify({username, password});
    return response.data.account;
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        load: (state, action: PayloadAction<{user_id: number; username: string; code: string; role: string; status: string} | null >) => {
            if (action.payload !== null)
                state.account = action.payload;
        },
        logout: (state) => {
            state.account.user_id = 0;
            state.account.username = "";
            state.account.code = "";
            state.account.role = "";
            state.account.status = "";
            localStorage.clear();
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginSpotify.fulfilled, (state, action) => {
                state.account = action.payload;
                const { user_id, username, code, role, status } = action.payload;
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("username", username);
                localStorage.setItem("code", code);
                localStorage.setItem("role", role);
                localStorage.setItem("status", status);
            })
            .addCase(loginSpotify.rejected, (state, action) => {
                state.error = action.error.message?.toString();
            })
    },
});

export default authSlice.reducer;

export const { load, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.user.account;