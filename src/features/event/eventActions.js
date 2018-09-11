import { toastr } from 'react-redux-toastr'
import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT , FETCH_EVENTS} from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { fetchSampleData } from '../../app/data/mockAPI'


// 加 TOASTR之前
// export const createEvent = (event) => {
//     return {
//         type: CREATE_EVENT,
//         payload: {
//             event
//         }
//     }
// }
// 加 TOASTR之后
export const createEvent = event => {
    return async dispatch => {
        try {
            dispatch({
                type: CREATE_EVENT,
                payload: {
                    event
                }
            });
            toastr.success('Success', 'Event has been created')
        } catch (error) {
            toastr.error('Oops', 'Something went wrong')
        }
    };
};


// 加 TOASTR之前
// export const updateEvent = (event) => {
//     return {
//         type: UPDATE_EVENT,
//         payload: {
//             event
//         }
//     }
// }
// 加 TOASTR之后
export const updateEvent = event => {
    return async dispatch => {
        try {
            dispatch({
                type: UPDATE_EVENT,
                payload: {
                    event
                }
            });
            toastr.success('Success', 'Event has been updated')
        } catch (error) {
            toastr.error('Oops', 'Something went wrong')
        }
    };
};


export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        payload: {
            eventId
        }
    }
}


//////////////////////////////FOR ASYNC///////////////////////
export const fetchEvents = (events) => {
    return {
        type: FETCH_EVENTS,
        payload: events
    }
}

//dispatch  method
export const loadEvents = () => {
    return async dispatch => {
        try {
            dispatch(asyncActionStart())
            let events = await fetchSampleData();
            dispatch(fetchEvents(events))
            dispatch(asyncActionFinish());
        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
        }
    }
}