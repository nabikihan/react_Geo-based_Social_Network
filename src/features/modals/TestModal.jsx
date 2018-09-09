import React from 'react';
import { Modal } from 'semantic-ui-react';
import { closeModal } from './modalActions'
import { connect } from 'react-redux'

const actions = {
    closeModal
}

const TestModal = ({closeModal}) => {
    return (
        <Modal closeIcon="close" open={true} onClose={closeModal}>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>Test Modal... nothing to see here</p>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
};


// NULL是指 map state。我们这里没有用到 只是直接调用了action来关闭modal， 所以我们的第一个input为NULL
export default connect(null, actions)(TestModal);