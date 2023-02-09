import { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';

const getRand = () => `${Math.random() * Math.random() * 100000}`;
import { PlaylistType } from '../../common/types';

interface Props {
  mode: 'Edit' | 'Add';
  playlist?: PlaylistType;
  showModal: boolean;
  onAddPlaylist: (item: PlaylistType) => void;
  onCloseModal: () => void;
  onEditPlaylist: (item: PlaylistType) => void;
}

const PlaylistModal = ({
  mode,
  playlist,
  showModal,
  onAddPlaylist,
  onCloseModal,
  onEditPlaylist
}: Props) => {
  const isEditMode = mode === 'Edit';

  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    if (isEditMode && playlist) setPlaylistName(playlist.name);
  }, [showModal]);

  const reset = () => {
    setPlaylistName('');
  };

  const handleClearModal = () => {
    onCloseModal();
    reset();
  };

  const handleAddItem = () => {
    if (isEditMode) onEditPlaylist({ ...playlist, name: playlistName } as PlaylistType);
    else {
      const key = getRand();
      onAddPlaylist({ name: playlistName, id: key, key });
    }
    onCloseModal();
    reset();
  };

  return (
    <Modal
      title={`${mode} Playlist`}
      centered
      open={showModal}
      onOk={handleAddItem}
      onCancel={handleClearModal}
      okText='Confirm'
      okButtonProps={{ disabled: playlistName.trim() === '' }}
      keyboard
    >
      <div>
        <label htmlFor='input-name'>Name:</label>
        <Input
          placeholder='Lecture slides'
          type='text'
          required
          id='input-name'
          value={playlistName}
          onChange={(evt) => setPlaylistName(evt.target.value)}
        />
      </div>
    </Modal>
  );
};

export default PlaylistModal;
