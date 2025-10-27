import React from 'react';
import Modal from './Modal';
import Button from './Button';

const DeleteConfirm = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="py-4">
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;

