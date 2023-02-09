import axios from './axios';

import { MediaType } from '../common/types';

export const getPlaylistMediaById = (playlistId: string): Promise<MediaType[]> =>
  axios.get(`/media/playlist/${playlistId}`).then((res) => res.data);

export const getMediaById = (mediaId: string): Promise<MediaType> =>
  axios.get(`/media/${mediaId}`).then((res) => res.data);

export const deleteMediaById = (mediaId: string): Promise<MediaType> =>
  axios.delete(`/media/${mediaId}`).then((res) => res.data);

export const updateMediaById = (params: {
  mediaId: string;
  payload: Partial<MediaType>;
}): Promise<MediaType> =>
  axios.put(`/media/${params.mediaId}`, params.payload).then((res) => res.data);

export const postNewMedia = (payload: Omit<MediaType, 'id'>): Promise<MediaType> =>
  axios.post(`/media/`, payload).then((res) => res.data);
