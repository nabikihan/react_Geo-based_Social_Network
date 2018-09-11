import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button } from 'semantic-ui-react';
import EventListAttendee from './EventListAttendee';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';


// as="a"的意思就是，它们都是link
class EventListItem extends Component {
    render() {
        const {event, deleteEvent} = this.props;
        return (
            <Segment.Group>

                <Segment>
                    <Item.Group>
                        <Item>
                            <Item.Image size="tiny" circular src={event.hostPhotoURL} />
                            <Item.Content>
                                <Item.Header as="a">{event.title}</Item.Header>
                                <Item.Description>
                                    Hosted by <a>{event.hostedBy}</a>
                                </Item.Description>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>

                <Segment>
                      <span>
                        <Icon name="clock" /> {format(event.date, 'dddd Do MMMM')} at
                          {format(event.date, 'HH:mm')}|
                           <Icon name="marker" /> {event.venue}
                      </span>
                </Segment>

                <Segment secondary>
                    <List horizontal>

                        {/*这里，在用了firestore之后，由于我们把attendee设为object（原因笔记里说明了），所以我们不可以用map了
                        所以我们用object.values把attendee转化为array*/}
                        {event.attendees && Object.values(event.attendees).map((attendee, index) => (
                            <EventListAttendee key={index} attendee={attendee}/>
                        ))}

                    </List>
                </Segment>

                <Segment clearing>
                    <span>{event.description}</span>
                    <Button onClick={deleteEvent(event.id)} as="a" color="red" floated="right" content="Delete" />

                    {/*这里点view去event detail page*/}
                    <Button as={Link} to={`/event/${event.id}`} color="teal" floated="right" content="View" />
                </Segment>
            </Segment.Group>

        );
    }
}

export default EventListItem;