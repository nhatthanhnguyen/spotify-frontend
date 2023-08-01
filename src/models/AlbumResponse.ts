export interface AlbumResponse {
    album_id: number;
    name: string;
    artist_id: number;
    cover_img: string;
}

export interface AlbumExpandResponse {
    album_id: number;
    name: string;
    artist_id: number;
    cover_img: string;
    artist_name: string | undefined;
}