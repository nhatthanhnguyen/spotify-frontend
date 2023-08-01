export interface PlaylistResponse {
    play_list_id: number;
    name: string;
    cover_img: string;
    user_id: number;
}

export interface PlaylistExpandResponse {
    play_list_id: number;
    name: string;
    cover_img: string;
    user_id: number;
    username: string;
}