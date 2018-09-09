import { createReducer } from '../../app/common/util/reducerUtil';
import { CREATE_EVENT, DELETE_EVENT, FETCH_EVENTS, UPDATE_EVENT } from './eventConstants';

//原来这里是 fake data，后来data移到专门的folder中，这个就为空了。
const initialState = [];

//这里是从action 到 reducer（由containercomponent来dispatch) payload对应action中给的payload，也就是event
// 这里的state为initial state，这个是在REDUCER UTIL中设置的对应关系。

//我们copy 了原有的state（...state），然后在它的基础上，我们要再加新的state：Object.assign({}, payload.event)。 这里就是我们先create一个新的object，
//然后我们把PAYLOAD中的event 放到这个空的object中，然后把整个这个新的state（with payload event）APPEND给原来的state
export const createEvent = (state, payload) => {
    return [...state, Object.assign({}, payload.event)]
}


// filTER中就是我们把当前ID（payload event） 和 原有的event中的ID 相等的event filter掉（保留满足条件的event），让event只剩下与payload event ID不想等的event，
//然后 我们把PAYLOAD EVENT 赋予给filtered event的state
export const updateEvent = (state, payload) => {
    return [
        ...state.filter(event => event.id !== payload.event.id),
        Object.assign({}, payload.event)
    ]
}

//同理, 注意参数，这里delete在actions中的参数是eventID，所以payload直接调用eventID
export const deleteEvent = (state, payload) => {
    return [
        ...state.filter(event => event.id !== payload.eventId)
    ]
}


//////////////////////////////FOR ASYNC///////////////////////

//由于initial state为空， 所以我们这里fetchevent就要求把payload中 的events直接加到initial state中，所以写的这么简单。
// 而且 payload中的events也是array，所以也不用什么麻烦的转化
export const fetchEvents = (state, payload) => {
    return payload.events
}


export default createReducer(initialState, {
    [CREATE_EVENT]: createEvent,
    [UPDATE_EVENT]: updateEvent,
    [DELETE_EVENT]: deleteEvent,
    [FETCH_EVENTS]: fetchEvents
})