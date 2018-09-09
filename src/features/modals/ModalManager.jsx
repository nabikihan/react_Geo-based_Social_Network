import React from 'react'
import { connect } from 'react-redux'
import TestModal from './TestModal'
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal'


//modalmanager用来协调modal的open和close。 当我们click button，open了一个modal的时候， 它会去modalaction中，get the modal type and
// modal payload。然后就是去modal reducer中，这里会更新 modal的state（modal props), 然后把更新的state 放到store里。我们的modal manager会
// map the store，把 updated modal取出。如果确实 updated modal存在，则我们就call 下面的function，DEstructure the modal object that WE get.
// return updated modal PROPS 并且把它展示出来. 所以我们要把modalmanager 加到APP.JS 中。


// 这个用来标记当前哪个modal open， 这里的写法要和NAV BAR中的 openmodal 对应
const modalLookup = {
    TestModal,
    LoginModal,
    RegisterModal
}


//从store里面把update 的modal取出来
const mapState = (state) => ({
    currentModal: state.modals
})

const ModalManager = ({currentModal}) => {
    let renderedModal;

    //如果 store有modal ， 则我们把modal的props render出去。
    if (currentModal) {
        const {modalType, modalProps} = currentModal;
        const ModalComponent = modalLookup[modalType];

        renderedModal = <ModalComponent {...modalProps}/>
    }
    return <span>{renderedModal}</span>
}

export default connect(mapState)(ModalManager)