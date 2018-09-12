import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux'
import { compose } from 'redux';
import{withFirestore, firebaseConnect, isEmpty} from 'react-redux-firebase'
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
//import { toastr } from 'react-redux-toastr';

import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import {goingToEvent} from "../../user/userActions";
import {cancelGoingToEvent} from "../../user/userActions";

import { addEventComment } from '../eventActions';


//这里我们要从events array中得到当前要显示的那个event。
//首先我们要把eventID找到，利用路径找到。这里我们加了第二个input。因为我们的router props作为该component的自带props，所以
//我们直接写就可以了。它不是从store中得到的。
// 然后，我们用filter， 当eventS 数据中的ID和当前ID相等时，我们保留该event， 把不想等的都filter掉
// const mapState = (state, ownProps) => {
//     const eventId = ownProps.match.params.id;
//
//     // 设这个empty event就是为了防止出现error。因为有可能这个路径是错误的，没有这个ID，这这时我们只会得到一个空白页面， 这时不满足if条件
//     //直接返回empty event。
//     let event = {};
//
//     if (eventId && state.events.length > 0) {
//         event = state.events.filter(event => event.id === eventId)[0]
//     }
//
//     return {
//         event
//     }
// }

// after firestore
const mapState = (state, ownProps) => {
    let event = {};

    // 当array为空的时候，第一个条件也能过，所以要加第二个条件
    if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
        event = state.firestore.ordered.events[0];
    }

    return {
        event,
        auth: state.firebase.auth,
        eventChat:
        !isEmpty(state.firebase.data.event_chat) &&
        objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
    };
};


const actions = {
    goingToEvent,
    cancelGoingToEvent,
    addEventComment
};


// componentDidMount()和componentWillUnmount()是经典的 react redux 从 后端取data到前端的做法
class EventDetailedPage extends Component {

    async componentDidMount() {
        const { firestore, match } = this.props;

        // 用.GET从fire store中取， 由于在eventlistitem中，我们设置了view button，把当前eventID 写在了路径了，这里用这个ID去firestore中找数据。
        // let event = await firestore.get(`events/${match.params.id}`);
        // console.log(event);
        // if(!event.exists) {
        //     history.push('/events');
        //     toastr.error('Sorry, event not found');
        // }
        await firestore.setListener(`events/${match.params.id}`);
    }

    async componentWillUnmount() {
        const { firestore, match } = this.props;
        await firestore.unsetListener(`events/${match.params.id}`);
    }

    render() {
        const { event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat } = this.props;

        // 使用helper中的function，得到both KEY and VALUES,右侧显示attendee
        const attendees =
            event && event.attendees && objectToArray(event.attendees);


        // 确定attendeE, 就是当前的user
        const isHost = event.hostUid === auth.uid;
        const isGoing = attendees && attendees.some(a => a.id === auth.uid);

        // chat
        const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);


        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventDetailedHeader
                        event={event}
                        isHost={isHost}
                        isGoing={isGoing}
                        goingToEvent={goingToEvent}
                        cancelGoingToEvent={cancelGoingToEvent}
                    />
                    <EventDetailedInfo event={event} />
                    <EventDetailedChat eventChat={chatTree} addEventComment={addEventComment} eventId={event.id} />
                </Grid.Column>

                {/*右侧显示attendee*/}
                <Grid.Column width={6}>
                    <EventDetailedSidebar attendees={attendees} />
                </Grid.Column>
            </Grid>
        );
    }
}

//之前的， without fire store
// const EventDetailedPage = ({event}) => {
//     return (
//         <Grid>
//             <Grid.Column width={10}>
//                 <EventDetailedHeader event={event} />
//                 <EventDetailedInfo event={event} />
//                 <EventDetailedChat />
//             </Grid.Column>
//             <Grid.Column width={6}>
//                 <EventDetailedSidebar attendees={event.attendees}/>
//             </Grid.Column>
//         </Grid>
//     );
// };


// 因为我们要从fire store取events数据，所以我们用firestore HOC
//export default withFirestore(connect(mapState, actions)(EventDetailedPage));

// after adding chat
export default compose(
    withFirestore,
    connect(mapState, actions),
    firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);