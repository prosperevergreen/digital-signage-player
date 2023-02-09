import axios from './axios';

import { PlaylistType } from '../common/types';

export const getPlaylists = (): Promise<PlaylistType[]> =>
  axios.get(`/playlists/`).then((res) => res.data);

export const getPlaylistById = (playlistId: string): Promise<PlaylistType> =>
  axios.get(`/playlists/${playlistId}`).then((res) => res.data);

export const deletePlaylistById = (playlistId: string): Promise<PlaylistType> =>
  axios.delete(`/playlists/${playlistId}`).then((res) => res.data);

export const updatePlaylistById = (params: {
  playlistId: string;
  payload: Partial<PlaylistType>;
}): Promise<PlaylistType> =>
  axios.put(`/playlists/${params.playlistId}`, params.payload).then((res) => res.data);

export const postNewPlaylist = (payload: Omit<PlaylistType, 'id'>): Promise<PlaylistType> =>
  axios.post(`/playlists/`, payload).then((res) => res.data);
