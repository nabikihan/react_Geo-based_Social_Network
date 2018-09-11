import React from 'react'
import { Header, Segment } from 'semantic-ui-react'


// EVENT dashboard的右侧显示内容
const EventActivity = () => {
    return (
        <div>
            <Header attached='top' content='Recent Activity'/>
            <Segment attached>
                <p>Recent activity</p>
            </Segment>
        </div>
    )
}

export default EventActivity