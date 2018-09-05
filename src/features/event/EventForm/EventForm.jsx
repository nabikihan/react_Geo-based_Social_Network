import React, { Component } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';



const emptyEvent = {
    title: '',
    date: '',
    city: '',
    venue: '',
    hostedBy: ''
}

class EventForm extends Component {

    // state = {
    //     event: {
    //         title: '',
    //         date: '',
    //         city: '',
    //         venue: '',
    //         hostedBy: ''
    //     }
    // }

    // initial state
    state = {
        event: emptyEvent
    }

//这个是个react的flow，它就是当一个component is mounted（成立），它就会马上被call，那么它就会check是否有event被pass in，
    //如果有，则 会update event。 但是它只会被run一次，就是说，当你的第一个event 被click之后，它update了form中的event的参数，
    // 如果你click了第二个event，你发现你的form的参数不变，因为这个function不会再被run了，你的参数不会再被更新。

    // 这个SELECTED event是由DASHboard中state设置 然后传给form的， 这里通过props取出
    componentDidMount() {
        if (this.props.selectedEvent !== null) {
            this.setState({
                event: this.props.selectedEvent
            })
        }
    }

    //this.props.selectedEvent就是上一个event，nextProps.selectedEvent为当前新触发的event
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedEvent !== this.props.selectedEvent) {
            this.setState({
                event: nextProps.selectedEvent || emptyEvent
            })
        }
    }

///////////////////////////////////////uncontrolled FORM ////////////////////////////////////////////////////////////
    //uncontrolled form，如下，我们不设置state， 在render中，加入REF参数. 我们去run一下，在title中输入个什么，然后点submit，就可以在console中看到我们输入的东西了
    //之所以叫做uncontrolled form是因为，我们并不知道这个REF的value是啥。。。而且，ref是直接从actual dom中拿到的值，不是virtual dom
    //render:
    // <Form.Field>
    //   <label>Event Title</label>
    //   <input ref='title' onChange={this.onInputChange} value={event.title} placeholder="Event Title" />
    // </Form.Field>
    //
    // function:
    // onFormSubmit = (evt) => {
    //     evt.preventDefault();
    //     console.log(this.refs.title.value);
    // }

///////////////////////////////////////controlled FORM ////////////////////////////////////////////////////////////
    //首先设置state。把需要改变的参数放到state中，因为核心思想就是，我们要通过setstate来改变input的参数。所以我们要设一个change函数
    // 这时，如果我们input title，然后点submit，我们看到 console中出现我们的input，这时通过check state来得到的，而我们input已经保存到了
    // cstate中。
    //render:
    // <Form.Field>
    //   <label>Event Title</label>
    //   <input onChange={this.onTitleChange} value={event.title} placeholder="Event Title" />
    // </Form.Field>
    //

    //   state={
    //         event:{
    //            title:''
    //         }
    // }

    // function:
    // onFormSubmit = (evt) => {
    //     evt.preventDefault();
   //     console.log(this.state.event);
    // }
    // function:
    // onTitleChange = (evt) => {
    //    this.setState({
    //        event: {
    //          title: evt.target.value
    //        }
    //    })
    // }


    onFormSubmit = (evt) => {

        //.preventDefault()用来prevent thisform actually sending ANY real data， 因为我们会在form中写一些东西，我们会点击submit来测试
        //但是我们不希望真正把这个test的input send给。。。

        //createevent 这个参数是个function，它是由DASHBOARD传进来的，传给了component ，用props取
        evt.preventDefault();

        //console.log(this.state.event);

        //如果当前的event存在，则，我们用DASHBOARD传入的update event更新当前event，否则的话，就是 create一个event
        // 都是把form的event作为input 然后调用DASHboard中的function， 而这个event是根据render中的value，也就是你的form的input来决定的
        if (this.state.event.id) {
            this.props.updateEvent(this.state.event);
        } else {
            this.props.createEvent(this.state.event)
        }

    };

    onInputChange = (evt) => {
        const newEvent = this.state.event;
        newEvent[evt.target.name] = evt.target.value;
        this.setState({
            event: newEvent
        })
    };




    render() {
        //由于handle cancel是由eventDASHBOARD中传入的，所以这里它不是state，而是props
        // 这里我们把event也deconstruct一下，是因为这样我们在render中，VALUE={this.STATE.event.title},可以简写了
        // 我们这里用state来获得event是因为我们用了control form。通过setstate来改变event的各种properties

        // 关于日历，你写上type为date，则自动给你引入日历
        const {handleCancel} = this.props;
        const {event} = this.state;

        return (
            <Segment>
                <Form onSubmit={this.onFormSubmit}>
                    <Form.Field>
                        <label>Event Title</label>
                        <input name='title' onChange={this.onInputChange} value={event.title} placeholder="Event Title" />
                    </Form.Field>
                    <Form.Field>
                        <label>Event Date</label>
                        <input name='date' onChange={this.onInputChange} value={event.date} type="date" placeholder="Event Date" />
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input name='city' onChange={this.onInputChange} value={event.city} placeholder="City event is taking place" />
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <input name='venue' onChange={this.onInputChange} value={event.venue} placeholder="Enter the Venue of the event" />
                    </Form.Field>
                    <Form.Field>
                        <label>Hosted By</label>
                        <input name='hostedBy' onChange={this.onInputChange} value={event.hostedBy} placeholder="Enter the name of person hosting" />
                    </Form.Field>
                    <Button positive type="submit">
                        Submit
                    </Button>
                    <Button onClick={handleCancel} type="button">Cancel</Button>
                </Form>
            </Segment>
        );
    }
}

export default EventForm;