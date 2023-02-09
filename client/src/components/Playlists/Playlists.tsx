import { useState, useMemo } from 'react';
import { Card, Table, Button, message } from 'antd';
import { RightOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import PlaylistModal from '../PlaylistModal/PlaylistModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';

import styles from './Playlists.module.scss';
import { ColumnsType } from 'antd/es/table';
import { PlaylistType } from '../../common/types';
import {
  useGetPlaylists,
  usePostPlaylist,
  useDeletePlaylistById,
  useUpdatePlaylistyById
} from '../../hooks/Playlists';

const Playlists = () => {
  const navigate = useNavigate();

  const [activePlaylist, setActivePlaylist] = useState<PlaylistType | undefined>();
  const [activePlaylistIndex, setActivePlaylistIndex] = useState<number | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const playlistQuery = useGetPlaylists({ keepPreviousData: true });
  if (playlistQuery.error)
    message.error(
      `An error occurred while retrieving playlists. Ensure server is reachable and refresh page.`,
      3
    );
  const playlists = playlistQuery.data ?? [];
  const postPlaylistMutation = usePostPlaylist();
  if (postPlaylistMutation.error)
    message.error(
      `An error occurred while creating playlist. Ensure server is reachable and refresh page.`,
      3
    );
  const deletePlaylistByIdMutation = useDeletePlaylistById();
  if (deletePlaylistByIdMutation.error)
    message.error(
      `An error occurred while deleting playlist. Ensure server is reachable and refresh page.`,
      3
    );
  const updatePlaylistByIdMutation = useUpdatePlaylistyById();
  if (updatePlaylistByIdMutation.error)
    message.error(
      `An error occurred while updating playlist. Ensure server is reachable and refresh page.`,
      3
    );

  const handleOpenAddEditModal = () => {
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleAddPlaylist = (newPlaylist: PlaylistType) => {
    postPlaylistMutation.mutate(newPlaylist);
  };

  const handleRowClick = (rowData: PlaylistType) => {
    if (!isEditMode) navigate(rowData.id);
  };

  const activatePlaylist = (rowData: PlaylistType, index: number) => {
    setActivePlaylist(rowData);
    setActivePlaylistIndex(index);
  };

  const handleEditActivePlaylist = (rowData: PlaylistType, index: number) => {
    activatePlaylist(rowData, index);
    handleOpenAddEditModal();
  };

  const editPlaylist = (updatedPlaylist: PlaylistType) => {
    if (
      activePlaylist &&
      activePlaylist.name !== updatedPlaylist.name &&
      typeof activePlaylistIndex === 'number'
    )
      updatePlaylistByIdMutation.mutate({
        playlistId: activePlaylist.id,
        updatedPlaylist,
        playlistIndex: activePlaylistIndex
      });
  };
  const handleDeleteActivePlaylist = (rowData: PlaylistType, index: number) => {
    activatePlaylist(rowData, index);
    handleOpenDeleteModal();
  };

  const deletePlaylist = () => {
    if (typeof activePlaylistIndex === 'number' && activePlaylist)
      deletePlaylistByIdMutation.mutate({
        playlistId: activePlaylist.id,
        playlistIndex: activePlaylistIndex
      });
  };

  const toggleEditMode = () => {
    setIsEditMode((prevValue) => !prevValue);
  };

  const playlistsCols: ColumnsType<PlaylistType> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (value: string) => <Button type='link'>{value}</Button>,
        sorter: (a, b) => (a > b ? -1 : 1)
      },
      ...(isEditMode
        ? ([
            {
              title: 'Actions',
              colSpan: 2,
              key: 'action',
              width: '50px',
              render: (_, rowData, index) => (
                <div className='action-btns'>
                  <Button type='link' onClick={() => handleEditActivePlaylist(rowData, index)}>
                    <EditOutlined />
                  </Button>
                  <Button
                    type='link'
                    danger
                    onClick={() => handleDeleteActivePlaylist(rowData, index)}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              )
            }
          ] as ColumnsType<PlaylistType>)
        : [
            {
              title: 'Action',
              key: 'action',
              width: '100px',
              render: () => (
                <Button block type='link'>
                  <RightOutlined />
                </Button>
              )
            }
          ])
    ],
    [isEditMode]
  );

  if (playlistQuery.error) {
    //
  }

  return (
    <div className={styles.PlaylistComponent}>
      <Card
        title='Playlists'
        actions={[
          <Button
            type='link'
            block
            key='add'
            onClick={handleOpenAddEditModal}
            disabled={isEditMode}
            icon={<PlusCircleOutlined size={30} />}
          >
            Add New Playlist
          </Button>
        ]}
        extra={
          <Button type='link' onClick={toggleEditMode} disabled={playlists.length === 0}>
            {isEditMode ? 'Cancel' : 'Edit'}
          </Button>
        }
      >
        <Table
          loading={playlistQuery.isLoading}
          columns={playlistsCols}
          dataSource={playlists}
          onRow={(rowData) => {
            return {
              onClick: () => {
                handleRowClick(rowData);
              }
            };
          }}
        />
      </Card>
      <PlaylistModal
        onAddPlaylist={handleAddPlaylist}
        showModal={showAddEditModal}
        onCloseModal={handleCloseAddEditModal}
        mode={isEditMode ? 'Edit' : 'Add'}
        playlist={activePlaylist}
        onEditPlaylist={editPlaylist}
      />
      <ConfirmDeleteModal
        dataName={activePlaylist?.name}
        onCancel={handleCloseDeleteModal}
        onConfirm={deletePlaylist}
        open={showDeleteModal}
        type='playlist'
      />
    </div>
  );
};

export default Playlists;
