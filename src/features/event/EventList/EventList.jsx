import React, { Component } from 'react'
import EventListItem from './EventListItem'

class EventList extends Component {
    render() {

        //我们在eventDASHboard中把events参数传给了eventlist，这时它被存入了component中， 我们可以通过props取出
        // 同理，这时你通过iteration，也把这个events传给了event list item。
        const {events} = this.props;
        return (
            <div>
                <h1>Event List</h1>

                {events.map((event) => (
                    <EventListItem key={event.id} event={event}/>
                ))}

            </div>
        )
    }
}

export default EventList
