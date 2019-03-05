import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import InputId from './InputId';
import ShowId from './ShowId';
import './modal.css';

const Modal = ({ isModalVisible, modalType, closeModal }) => {
  if (isModalVisible) {
    return (
      <div className="modal-container">
        {modalType === 'create' ? <ShowId /> : <InputId />}
        <Button onClick={closeModal}>Cancel</Button>
      </div>
    );
  }
  return null;
};

Modal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  modalType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;
