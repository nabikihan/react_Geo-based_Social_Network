import React from 'react'
import { Header, Segment, Feed, Sticky } from 'semantic-ui-react'
import EventActivityItem from './EventActivityItem'


// EVENT dashboard的右侧显示内容
// setup好 cloud firebase之后来handle这个
const EventActivity = ({activities, contextRef}) => {
    return (
        <Sticky context={contextRef} offset={100}>
            <Header attached='top' content='Recent Activity'/>
            <Segment attached>
                <Feed>
                    {activities && activities.map((activity) => (
                        <EventActivityItem key={activity.id} activity={activity}/>
                    ))}
                </Feed>
            </Segment>
        </Sticky>
    )
}

export default EventActivity