import { useState, useMemo } from 'react';
import { Card, Table, Button, message } from 'antd';
import {
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PictureFilled,
  VideoCameraFilled
} from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';

import MediaModal from '../MediaModal/MediaModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';

import styles from './Playlist.module.scss';
import { ColumnsType } from 'antd/es/table';
import { MediaType } from '../../common/types';
import {
  useGetPlaylistMediaById,
  useDeleteMediaById,
  usePostNewMedia,
  useUpdateMediaById
} from '../../hooks/Media';
import { useGetPlaylistById } from '../../hooks/Playlists';

const Playlist = () => {
  const params = useParams();
  const { playlistId } = params;

  const [activeMedia, setActiveMedia] = useState<MediaType | undefined>();
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | undefined>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getPlaylistByIdQuery = useGetPlaylistById(playlistId ?? '');

  if (getPlaylistByIdQuery.error)
    message.error(
      `An error occurred while retrieving media for playlist. Ensure server is reachable and refresh page.`,
      3
    );

  const playlistItem = getPlaylistByIdQuery?.data ?? { name: '' };

  const getPlaylistMediaQuery = useGetPlaylistMediaById(playlistId || '');

  if (getPlaylistMediaQuery.error)
    message.error(
      `An error occurred while retrieving media for playlist. Ensure server is reachable and refresh page.`,
      3
    );

  const mediaItems = getPlaylistMediaQuery?.data ?? [];

  const deleteMediaByIdMutation = useDeleteMediaById();
  if (deleteMediaByIdMutation.error)
    message.error(
      `An error occurred while deleting media. Ensure server is reachable and refresh page.`,
      3
    );
  const postNewMediaMutation = usePostNewMedia();
  if (postNewMediaMutation.error)
    message.error(
      `An error occurred while creating media. Ensure server is reachable and refresh page.`,
      3
    );
  const updateMediaById = useUpdateMediaById();
  if (updateMediaById.error)
    message.error(
      `An error occurred while updating media. Ensure server is reachable and refresh page.`,
      3
    );

  const handleOpenAddEditModal = () => {
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setIsEditMode(false);
    setShowAddEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleAddMedia = (newMedia: Omit<MediaType, 'id' | 'playlistId'>) => {
    if (playlistId) postNewMediaMutation.mutate({ ...newMedia, playlistId });
  };

  const activatePlaylist = (rowData: MediaType, index: number) => {
    setActiveMedia(rowData);
    setActiveMediaIndex(index);
  };

  const handleEditActiveMedia = (rowData: MediaType, index: number) => {
    activatePlaylist(rowData, index);
    setIsEditMode(true);
    handleOpenAddEditModal();
  };

  const editMedia = (modifiedMedia: MediaType) => {
    if (typeof activeMediaIndex === 'number' && activeMedia)
      updateMediaById.mutate({
        mediaId: activeMedia.id,
        mediaIndex: activeMediaIndex,
        modifiedMedia: modifiedMedia
      });
    setIsEditMode(false);
  };

  const handleDeleteActiveMedia = (rowData: MediaType, index: number) => {
    activatePlaylist(rowData, index);
    handleOpenDeleteModal();
  };

  const deletePlaylist = () => {
    if (typeof activeMediaIndex === 'number' && activeMedia)
      deleteMediaByIdMutation.mutate({ mediaId: activeMedia.id, mediaIndex: activeMediaIndex });
  };

  const playlistMediaCols: ColumnsType<MediaType> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => (a > b ? -1 : 1),
        render: (value) => <div className='table-col-name'>{value}</div>
      },
      {
        title: 'Source',
        dataIndex: 'url',
        key: 'url',
        sorter: (a, b) => (a > b ? -1 : 1),
        responsive: ['md', 'lg'],
        render: (value) => <div className='table-col-source'>{value}</div>
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'id',
        filters: [
          { text: 'Image', value: 'IMAGE' },
          { text: 'Video', value: 'VIDEO' }
        ],
        onFilter: (value, record) => record.type === value,
        sorter: (a, b) => (a > b ? -1 : 1),
        render: (value) => (
          <div className='table-media-icon'>
            {value === 'IMAGE' ? <PictureFilled /> : <VideoCameraFilled />}
          </div>
        )
      },
      {
        title: 'Actions',
        colSpan: 2,
        width: '50px',
        render: (_, rowData, index) => (
          <div className='action-col'>
            <Button type='link' onClick={() => handleEditActiveMedia(rowData, index)}>
              <EditOutlined />
            </Button>
            <Button type='link' danger onClick={() => handleDeleteActiveMedia(rowData, index)}>
              <DeleteOutlined />
            </Button>
          </div>
        )
      }
    ],
    [isEditMode]
  );

  return (
    <div className={styles.PlaylistComponent}>
      <Card
        title={`Playlist: ${playlistItem.name}`}
        actions={[
          <Button
            type='link'
            block
            key='add'
            onClick={handleOpenAddEditModal}
            icon={<PlusCircleOutlined />}
          >
            Add New Media
          </Button>,
          <Link to={`/player/${playlistId}`} key='play'>
            <Button
              disabled={mediaItems.length === 0}
              type='link'
              block
              icon={<PlayCircleOutlined />}
              className='play-button'
            >
              Play
            </Button>
          </Link>
        ]}
        extra={
          <Link to='..'>
            <Button type='link'>Back</Button>
          </Link>
        }
      >
        <Table
          columns={playlistMediaCols}
          dataSource={mediaItems}
          loading={getPlaylistMediaQuery.isLoading}
        />
      </Card>
      <MediaModal
        onAddMedia={handleAddMedia}
        showModal={showAddEditModal}
        onCloseModal={handleCloseAddEditModal}
        mode={isEditMode ? 'Edit' : 'Add'}
        media={activeMedia}
        onEditMedia={editMedia}
      />
      <ConfirmDeleteModal
        dataName={activeMedia?.name}
        onCancel={handleCloseDeleteModal}
        onConfirm={deletePlaylist}
        open={showDeleteModal}
        type='media'
      />
    </div>
  );
};

export default Playlist;
