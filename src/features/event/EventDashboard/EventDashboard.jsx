import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import EventForm from '../EventForm/EventForm';
import cuid from 'cuid';

const eventsDashboard = [
    {
        id: '1',
        title: 'Trip to Tower of London',
        date: '2018-03-27',
        category: 'culture',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
        city: 'London, UK',
        venue: "Tower of London, St Katharine's & Wapping, London",
        hostedBy: 'Bob',
        hostPhotoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
        attendees: [
            {
                id: 'a',
                name: 'Bob',
                photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
            },
            {
                id: 'b',
                name: 'Tom',
                photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
            }
        ]
    },
    {
        id: '2',
        title: 'Trip to Punch and Judy Pub',
        date: '2018-03-28',
        category: 'drinks',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
        city: 'London, UK',
        venue: 'Punch & Judy, Henrietta Street, London, UK',
        hostedBy: 'Tom',
        hostPhotoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
        attendees: [
            {
                id: 'b',
                name: 'Tom',
                photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            {
                id: 'a',
                name: 'Bob',
                photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
            }
        ]
    }
];


//注意， event form是在DASHboard的state中设置的, 意思就是，如果它是open的，则show event form，否则则hide
// 而events[] 这里也是state是因为，没有parent可以把这个数据传给它，它就是源头
class EventDashboard extends Component {

    // constructor() {
    //     super();
    //
    //     this.state = {
    //         events: eventsDashboard,
    //         isOpen: false
    //     };
    //
    //     // this.handleFormOpen = this.handleFormOpen.bind(this);
    //     // this.handleCancel = this.handleCancel.bind(this);
    // }

    state = {
        events: eventsDashboard,
        isOpen: false,
        selectedEvent: null
    };

    //我们设这两个function就是为了可以change state，这是唯一的做法
    //我们用这种arrow function的写法，可以不用在constructor里面写BIND THIS, 因为当function很多的时候，你在constructor里写
    //很多BIND THIS很丑。。。

    //如果你要pass一个input通过这个function，那么你要这么写， 然后你必须在render中，使用这个function的时候这么写。
    // onclick={this.handleformopen（input）}
    //我们尽量避免在render中写arrow function，可以在单独写function的时候使用复杂的arrow function
    // handleFormOpen = (input) => () => {
    //    console.LOG(INPUT)
    // };


    handleFormOpen = () => {
        this.setState({
            selectedEvent: null,
            isOpen: true
        });
    };

    handleCancel = () => {
        this.setState({
            isOpen: false
        });
    };


///////////////////////////////////////CREATE FORM ////////////////////////////////////////////////////////////
    // 与EVENT FORM页面关联
    //用CUID来createID
    //我们把这个新event加入到state中的原有的event中。...就是指代原event中的每个element，那么这个updatedEvents我们为什么要把它设为array呢？
    // 因为我们的原event就是个array，加了一个新event还是个array，其实[...this.state.events, newEvent]这个就可以看成是新event array的组成
    // ...是之前的两个event，然后第三个event就是newevent。
    // submit结束，我们要关闭create页面
    handleCreateEvent = (newEvent) => {
        newEvent.id = cuid();
        newEvent.hostPhotoURL = '/assets/user.png';
        const updatedEvents = [...this.state.events, newEvent];
        this.setState({
            events: updatedEvents,
            isOpen: false
        })
    }


///////////////////////////////////////update FORM ////////////////////////////////////////////////////////////

    //Object.assign({}, updatedEvent)的意思就是，我们create一个empty event，然后我们把updatedevent assign给它。这个replace当前的object
    handleUpdateEvent = (updatedEvent) => {
        this.setState({
            events: this.state.events.map(event => {
                if (event.id === updatedEvent.id) {
                    return Object.assign({}, updatedEvent)
                } else {
                    return event
                }
            }),
            isOpen: false,
            selectedEvent: null
        })
    }



///////////////////////////////////////read/VIEW FORM ////////////////////////////////////////////////////////////
// 当我们点view这个button，我们希望旁边的表单可以show出event的细节
    handleOpenEvent = (eventToOpen) => () => {
        this.setState({
            selectedEvent: eventToOpen,
            isOpen: true
        })
    }

///////////////////////////////////////delete FORM ////////////////////////////////////////////////////////////

    //就是说filer ID相等的，留下ID不想等的，也就是删除EVENTID 与当前ID相等的event
    handleDeleteEvent = (eventId) => () => {
        const updatedEvents = this.state.events.filter(e => e.id !== eventId);
        this.setState({
            events: updatedEvents
        })
    }




    //你用的是this.handleFormOpen，而不是this.handleFormOpen()，因为，如果你用了带括号的，说明当我们render页面的时候，这个function会
    //立刻生效。我们不希望这样，我们希望我一点button才可以生效，所以不用带括号的。
    //这里的THIS 是指the component class，也就是eventDASHBOARD . 当我们ONCLICK call到这个function的是欧，我们会去COMPONENT的当前class中去找这个function，
    //但是我们找不到，所以，我们要把这个function 特意BIND一下
   render() {
       const {selectedEvent} = this.state;

        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList events={this.state.events} onEventOpen={this.handleOpenEvent} deleteEvent={this.handleDeleteEvent} />
                </Grid.Column>
                <Grid.Column width={6}>
                    <Button
                        onClick={this.handleFormOpen}
                        positive
                        content="Create Event"
                    />
                    {this.state.isOpen && <EventForm handleCancel={this.handleCancel}
                                                     createEvent={this.handleCreateEvent}
                                                     updateEvent={this.handleUpdateEvent}
                                                     selectedEvent={selectedEvent}/>
                    }

                </Grid.Column>
            </Grid>
        );
    }
}

export default EventDashboard;