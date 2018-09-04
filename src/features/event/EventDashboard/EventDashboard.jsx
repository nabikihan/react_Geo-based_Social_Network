import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import EventForm from '../EventForm/EventForm';

const eventsDashboard = [
    {
        id: '1',
        title: 'Trip to Tower of London',
        date: '2018-03-27T11:00:00+00:00',
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
        date: '2018-03-28T14:00:00+00:00',
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

    // state = {
    //     events: eventsDashboard,
    //     isOpen: false
    // };

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
            isOpen: true
        });
    };

    handleCancel = () => {
        this.setState({
            isOpen: false
        });
    };

    //你用的是this.handleFormOpen，而不是this.handleFormOpen()，因为，如果你用了带括号的，说明当我们render页面的时候，这个function会
    //立刻生效。我们不希望这样，我们希望我一点button才可以生效，所以不用带括号的。
    //这里的THIS 是指the component class，也就是eventDASHBOARD . 当我们ONCLICK call到这个function的是欧，我们会去COMPONENT的当前class中去找这个function，
    //但是我们找不到，所以，我们要把这个function 特意BIND一下
   render() {
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList events={this.state.events} />
                </Grid.Column>
                <Grid.Column width={6}>
                    <Button
                        onClick={this.handleFormOpen}
                        positive
                        content="Create Event"
                    />
                    {this.state.isOpen && <EventForm handleCancel={this.handleCancel} />}

                </Grid.Column>
            </Grid>
        );
    }
}

export default EventDashboard;