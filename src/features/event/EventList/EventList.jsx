import React, { Component } from 'react'
import EventListItem from './EventListItem'
import InfiniteScroll from 'react-infinite-scroller';

class EventList extends Component {
    render() {

        //我们在eventDASHboard中把events参数传给了eventlist，这时它被存入了component中， 我们可以通过props取出
        // 同理，这时你通过iteration，也把这个events传给了event list item。
        const {events, getNextEvents, loading, moreEvents} = this.props;
        return (
            <div>

                {/*这里必须先 check是否有events，因为在使用fire store之后， 我们不再从memory中synchronous的取data（之前我们都是把fake data放在当前文件里面的），所以我们的*/}
                {/*component会先loads before WE get access TO our events data*/}
                {/*{events && events.map((event) => (*/}
                    {/*<EventListItem key={event.id}*/}
                                   {/*event={event}*/}
                                   {/*deleteEvent={deleteEvent}/>*/}
                {/*))}*/}

                {/*以下是sorting& infinite scroll之后的code*/}
                {events &&
                events.length !== 0 && (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={getNextEvents}
                        hasMore={!loading && moreEvents}
                        initialLoad={false}
                    >
                        {events && events.map(event => <EventListItem key={event.id} event={event}/>)}
                    </InfiniteScroll>
                )}

            </div>
        )
    }
}

export default EventList
