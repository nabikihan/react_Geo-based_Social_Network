import React, { Component } from 'react';
import { Segment, Grid, Icon, Button } from 'semantic-ui-react';
import EventDetailedMap from './EventDetailedMap';
import format from 'date-fns/format'


//我们设一个class，而不是一个function，是因为我们要track 一个state，就是设一个boolean来show map
class EventDetailedInfo extends Component {
    state = {
        showMap: false
    }

///////////////////////////clean map for goolge firestore ///////////////////////////////////////
// this is called immediately before a component is destroyed. we can perform necessary cleanup for any DOM created before
    //这里我们只是简单的把toggle turn off
    componentWillUnmount() {
        this.setState({
            showMap: false
        })
    }

/////////////////////////////google map/////////////////////////////////////
    //当我们要toggle一个东西的时候，我们要参照他的previous state，所以设定就是当前的showman 为previousstate的相反
    showMapToggle = () => {
        this.setState(prevState => ({
            showMap: !prevState.showMap
        }))
    }

    render() {

        //从 page中传入的
        const { event } = this.props;
        return (
            <Segment.Group>

                <Segment attached="top">
                    <Grid>
                        <Grid.Column width={1}>
                            <Icon size="large" color="teal" name="info" />
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <p>{event.description}</p>
                        </Grid.Column>
                    </Grid>
                </Segment>

                <Segment attached>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={1}>
                            <Icon name="calendar" size="large" color="teal" />
                        </Grid.Column>
                        <Grid.Column width={15}>

                            {/*时间 AM: PM*/}
                            <span>{format(event.date, 'dddd Do MMM')} at {format(event.date, 'h:mm A')}</span>
                        </Grid.Column>
                    </Grid>
                </Segment>

                <Segment attached>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={1}>
                            <Icon name="marker" size="large" color="teal" />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <span>{event.venue}</span>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Button onClick={this.showMapToggle} color="teal" size="tiny" content={this.state.showMap ? 'Hide Map' : 'Show Map'}/>
                        </Grid.Column>
                    </Grid>
                </Segment>

                {this.state.showMap &&
                <EventDetailedMap lat={event.venueLatLng.lat} lng={event.venueLatLng.lng}/>}
            </Segment.Group>
        );
    }
}

export default EventDetailedInfo;