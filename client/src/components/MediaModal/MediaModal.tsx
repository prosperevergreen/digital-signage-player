import { useEffect, useState } from 'react';
import { Modal, Input, Select } from 'antd';

const getRand = () => `${Math.random() * Math.random() * 100000}`;
import { MediaType } from '../../common/types';

interface Props {
  mode: 'Edit' | 'Add';
  media?: MediaType;
  showModal: boolean;
  onAddMedia: (item: Omit<MediaType, 'id' | 'playlistId'>) => void;
  onCloseModal: () => void;
  onEditMedia: (item: MediaType) => void;
}

const MediaModal = ({ mode, media, showModal, onAddMedia, onCloseModal, onEditMedia }: Props) => {
  const isEditMode = mode === 'Edit';

  const [mediaName, setMediaName] = useState('');
  const [mediaSource, setMediaSource] = useState('');
  const [mediaType, setMediaType] = useState<MediaType['type']>('IMAGE');

  useEffect(() => {
    if (!showModal) return;

    if (isEditMode && media) {
      setMediaName(media.name);
      setMediaSource(media.url);
      setMediaType(media.type);
    } else {
      reset();
    }
  }, [showModal]);

  const reset = () => {
    setMediaName('');
    setMediaSource('');
    setMediaType('IMAGE');
  };

  const handleClearModal = () => {
    onCloseModal();
  };

  const handleAddItem = () => {
    if (isEditMode)
      onEditMedia({ ...media, name: mediaName, url: mediaSource, type: mediaType } as MediaType);
    else {
      const key = getRand();
      onAddMedia({
        name: mediaName,
        key,
        url: mediaSource,
        type: mediaType
      });
    }
    onCloseModal();
  };

  return (
    <Modal
      title={`${mode} Media`}
      centered
      open={showModal}
      onOk={handleAddItem}
      onCancel={handleClearModal}
      okText='Confirm'
      okButtonProps={{ disabled: mediaName.trim() === '' || mediaSource.trim() === '' }}
      keyboard
    >
      <div>
        <label htmlFor='input-name'>Name:</label>
        <Input
          allowClear
          placeholder='Lecture slides'
          type='text'
          required
          id='input-name'
          value={mediaName}
          onChange={(evt) => setMediaName(evt.target.value)}
        />
        <br />
      </div>
      <div>
        <label htmlFor='input-url'>Source:</label>
        <Input
          allowClear
          placeholder='https://images-url.jpeg'
          type='url'
          required
          id='input-url'
          value={mediaSource}
          onChange={(evt) => setMediaSource(evt.target.value)}
        />
        <br />
      </div>
      <div>
        <label htmlFor='select-type'>Type:</label>
        <br />
        <Select
          id='select-type'
          defaultValue={mediaType}
          onChange={(value) => setMediaType(value)}
          options={[
            { value: 'IMAGE', label: 'Image' },
            { value: 'VIDEO', label: 'Video' }
          ]}
        />
      </div>
    </Modal>
  );
};

export default MediaModal;
