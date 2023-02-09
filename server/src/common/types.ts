export interface PlaylistType {
  id: string;
  name: string;
}

export interface MediaType extends PlaylistType {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  playlistId: string;
}
