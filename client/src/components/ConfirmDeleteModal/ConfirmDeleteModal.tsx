import { Modal } from 'antd';

interface Props {
  dataName?: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  type: 'playlist' | 'media';
}

const ConfirmDeleteModal = ({ dataName, open, onConfirm, onCancel, type }: Props) => {
  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };
  return (
    <Modal
      centered
      open={open}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText='Confirm'
      okType='danger'
      title={`Delete ${type}!`}
      keyboard
    >
      <p>Do you really want to delete ?</p>
      <p>{dataName}</p>
      {type === 'playlist' && <p>All media in playlist will be deleted as well.</p>}
    </Modal>
  );
};

export default ConfirmDeleteModal;
