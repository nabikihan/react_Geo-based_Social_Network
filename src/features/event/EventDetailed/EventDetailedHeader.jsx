import React from 'react';
import { Segment, Image, Item, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';


//这两个style就是调整header的图片的深度，然后把标题显示到图片上面等等。在render中用他们
const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

// after fire store
const EventDetailedHeader = ({ event, isHost, isGoing, goingToEvent, cancelGoingToEvent }) => {

    // 使用fire store的格式来取出时间。
    let eventDate;
    if (event.date) {
        eventDate = event.date.toDate();
    }
    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: '0' }}>
                <Image
                    src={`/assets/categoryImages/${event.category}.jpg`}
                    fluid
                    style={eventImageStyle}
                />

                <Segment basic style={eventImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size="huge"
                                    content={event.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(eventDate, 'dddd Do MMMM')}</p>
                                <p>
                                    Hosted by <strong>{event.hostedBy}</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>

            {/*这里的逻辑是，如果你不是host，如果你的状态是ISGOING, 则给你的选择是cancel， 如果不是going，则选择button为join*/}
            <Segment attached="bottom">
                {!isHost && (
                    <div>
                        {isGoing ? (
                            <Button onClick={() => cancelGoingToEvent(event)}>Cancel My Place</Button>
                        ) : (
                            <Button onClick={() => goingToEvent(event)} color="teal">JOIN THIS EVENT</Button>
                        )}
                    </div>
                )}

                {/*如果您是host，则你的button是manage event*/}
                {isHost && (
                    <Button
                        as={Link}
                        to={`/manage/${event.id}`}
                        color="orange"
                    >
                        Manage Event
                    </Button>
                )}
            </Segment>
        </Segment.Group>
    );
};

// before
// const EventDetailedHeader = ({event}) => {
//     return (
//         <Segment.Group>
//             <Segment basic attached="top" style={{ padding: '0' }}>
//                 <Image src={`/assets/categoryImages/${event.category}.jpg`} fluid style={eventImageStyle} />
//
//                 <Segment basic style={eventImageTextStyle}>
//                     <Item.Group>
//                         <Item>
//                             <Item.Content>
//                                 <Header
//                                     size="huge"
//                                     content={event.title}
//                                     style={{ color: 'white' }}
//                                 />
//                                 <p>{format(event.date, 'dddd Do MMMM')}</p>
//                                 <p>
//                                     Hosted by <strong>{event.hostedBy}</strong>
//                                 </p>
//                             </Item.Content>
//                         </Item>
//                     </Item.Group>
//                 </Segment>
//             </Segment>
//
//             <Segment attached="bottom">
//                 <Button>Cancel My Place</Button>
//                 <Button color="teal">JOIN THIS EVENT</Button>
//
//                 <Button as={Link} to={`/manage/${event.id}`} color="orange" floated="right">
//                     Manage Event
//                 </Button>
//             </Segment>
//         </Segment.Group>
//     );
// };

export default EventDetailedHeader;