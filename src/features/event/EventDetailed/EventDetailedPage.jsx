import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux'
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';


//这里我们要从events array中得到当前要显示的那个event。
//首先我们要把eventID找到，利用路径找到。这里我们加了第二个input。因为我们的router props作为该component的自带props，所以
//我们直接写就可以了。它不是从store中得到的。
// 然后，我们用filter， 当eventS 数据中的ID和当前ID相等时，我们保留该event， 把不想等的都filter掉
const mapState = (state, ownProps) => {
    const eventId = ownProps.match.params.id;

    // 设这个empty event就是为了防止出现error。因为有可能这个路径是错误的，没有这个ID，这这时我们只会得到一个空白页面， 这时不满足if条件
    //直接返回empty event。
    let event = {};

    if (eventId && state.events.length > 0) {
        event = state.events.filter(event => event.id === eventId)[0]
    }

    return {
        event
    }
}

const EventDetailedPage = ({event}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <EventDetailedHeader event={event} />
                <EventDetailedInfo event={event} />
                <EventDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <EventDetailedSidebar attendees={event.attendees}/>
            </Grid.Column>
        </Grid>
    );
};

export default connect(mapState)(EventDetailedPage);