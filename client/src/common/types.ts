export interface PlaylistType {
  id: string;
  name: string;
  key?: React.Key;
}

export interface MediaType extends PlaylistType {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  playlistId: string;
}

export interface MediaPlaylistRes {
  mediaItems: MediaType[];
  playlistItem: PlaylistType;
}
