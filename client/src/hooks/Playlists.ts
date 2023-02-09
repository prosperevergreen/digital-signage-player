import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query';

import { PlaylistType } from '../common/types';
import {
  getPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  postNewPlaylist
} from '../services/playlists';

export const useGetPlaylistById = (playlistId: string, options?: UseQueryOptions<PlaylistType>) =>
  useQuery<PlaylistType>(['GET_PLAYERLIST_BY_ID', playlistId], () => getPlaylistById(playlistId), {
    ...options
  });

export const useGetPlaylists = (options?: UseQueryOptions<PlaylistType[]>) =>
  useQuery<PlaylistType[]>(['GET_PLAYLISTS'], getPlaylists, {
    ...options
  });

export const useDeletePlaylistById = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { playlistId: string; playlistIndex: number }) =>
      deletePlaylistById(params.playlistId),
    {
      onSuccess(_, params) {
        queryClient.setQueryData<PlaylistType[]>('GET_PLAYLISTS', (cacheData) => {
          if (!cacheData) return [];
          const copyData = [...cacheData];
          copyData.splice(params.playlistIndex, 1);
          return copyData;
        });
      }
    }
  );
};

export const useUpdatePlaylistyById = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { updatedPlaylist: PlaylistType; playlistId: string; playlistIndex: number }) =>
      updatePlaylistById({ playlistId: params.playlistId, payload: params.updatedPlaylist }),
    {
      onSuccess(res, params) {
        queryClient.setQueryData<PlaylistType[]>('GET_PLAYLISTS', (cacheData) => {
          if (!cacheData) return [];
          const copyData = [...cacheData];
          copyData.splice(params.playlistIndex, 1, res);
          return copyData;
        });
      }
    }
  );
};

export const usePostPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation(postNewPlaylist, {
    onSuccess(res) {
      queryClient.setQueryData<PlaylistType[]>('GET_PLAYLISTS', (cacheData) => {
        if (!cacheData) return [];
        return [...cacheData, res];
      });
    }
  });
};
