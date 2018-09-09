import { MODAL_CLOSE, MODAL_OPEN } from './modalConstants';


// modalprops是啥？props就是各种东西，例如你想让modal show什么，可能是个表单，或者是个 string， anything。
export const openModal = (modalType, modalProps) => {
    return {
        type: MODAL_OPEN,
        payload: {
            modalType,
            modalProps
        }
    }
}

export const closeModal = () => {
    return {
        type: MODAL_CLOSE
    }
}