import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query';
import {
  getMediaById,
  getPlaylistMediaById,
  postNewMedia,
  updateMediaById,
  deleteMediaById
} from '../services/media';
import { MediaType } from '../common/types';

export const useGetPlaylistMediaById = (
  playlistId: string,
  options?: UseQueryOptions<MediaType[]>
) =>
  useQuery<MediaType[]>(
    ['GET_PLAYERLIST_MEDIA_BY_ID', playlistId],
    () => getPlaylistMediaById(playlistId),
    {
      ...options,
      cacheTime: 0,
      staleTime: 0
    }
  );

export const useGetMediaById = (playlistId: string, options?: UseQueryOptions<MediaType>) =>
  useQuery<MediaType>(['GET_MEDIA_BY_ID', playlistId], () => getMediaById(playlistId), {
    ...options
  });

export const useDeleteMediaById = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { mediaId: string; mediaIndex: number }) => deleteMediaById(params.mediaId),
    {
      onSuccess() {
        queryClient.invalidateQueries(['GET_PLAYERLIST_MEDIA_BY_ID']);
      }
    }
  );
};

export const useUpdateMediaById = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { mediaId: string; mediaIndex: number; modifiedMedia: Partial<MediaType> }) =>
      updateMediaById({ mediaId: params.mediaId, payload: params.modifiedMedia }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['GET_PLAYERLIST_MEDIA_BY_ID']);
      }
    }
  );
};

export const usePostNewMedia = () => {
  const queryClient = useQueryClient();
  return useMutation(postNewMedia, {
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_PLAYERLIST_MEDIA_BY_ID']);
    }
  });
};
