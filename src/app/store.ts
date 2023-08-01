import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/authSlice";
import playerReducer from "../features/player/playerSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        player: playerReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;