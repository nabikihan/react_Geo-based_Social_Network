/*global google*/
import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import Script from 'react-load-script';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux'
//import cuid from 'cuid';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';

import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate'
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { withFirestore } from 'react-redux-firebase';




// const emptyEvent = {
//     title: '',
//     date: '',
//     city: '',
//     venue: '',
//     hostedBy: ''
// }

// after redux
// eventform主要实现两个功能
//update form： 我们通过mapsTATE从store里面取出updated state。那么如果当前的路径有eventID，则我们把state filter成只剩同样eventID的
//              然后把event更新为 state中的updated 的数据 ，然后通过render调用 submit这个function来具体实现
// create form： 这时，eventID是不存在的，event 也为空， 这时调用submit function，通过CUID create一个新的ID，填写各个空缺，这时由于我们用了field/REDUX FORM
//              所以自动update了value（check之前的code版本，之前都是要在render里面设置value的，现在不用了），那么自动更新了value，这时我们跳用
//              actions中的create function，把value + ID作为新的event传进去，就可以create了。
// const mapState = (state, ownProps) => {
//     const eventId = ownProps.match.params.id;
//
//     let event = {};
//
//     if (eventId && state.events.length > 0) {
//         event = state.events.filter(event => event.id === eventId)[0];
//     }
//
//     return {
//         initialValues: event
//     };
// };

// after firebase
const mapState = (state) => {
    let event = {};

    if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
        event = state.firestore.ordered.events[0];
    }

    return {
        initialValues: event,
        event
    };
};



const actions = {
    createEvent,
    updateEvent,
    cancelToggle
}

//redux form
// select dropdown菜单的 options
const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];


// revalidate ， 很直接，就是用一个function就打包了所有的error message。 它是直接与event form挂钩，因为你用HOC 把它赋予给了event form
// 所以它自动去form里找你写的参数名称，然后它要求都是required，或者有长度要求，如果你不满足，则会出现error，这个error也将由 field中的component来handle。
const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Please provide a category'}),
    description: composeValidators(
        isRequired({message: 'Please enter a description'}),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('city'),
    venue: isRequired('venue'),
    date: isRequired('date')
})


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
        // 我们仍需要保留这个event，因为form被update之后，event也要update，我们要一致keeping track with theevent
        //event: emptyEvent

        //after redux form，event不需要了，event有redux form来create， 或者有store来update
        //event: Object.assign({}, this.props.event)

        //城市和business地点的经纬度
        cityLatLng: {},
        venueLatLng: {},
        scriptLoaded: false
    }

//这个是个react的flow，它就是当一个component is mounted（成立），它就会马上被call，那么它就会check是否有event被pass in，
    //如果有，则 会update event。 但是它只会被run一次，就是说，当你的第一个event 被click之后，它update了form中的event的参数，
    // 如果你click了第二个event，你发现你的form的参数不变，因为这个function不会再被run了，你的参数不会再被更新。

    // 这个SELECTED event是由DASHboard中state设置 然后传给form的， 这里通过props取出
    // componentDidMount() {
    //     if (this.props.selectedEvent !== null) {
    //         this.setState({
    //             event: this.props.selectedEvent
    //         })
    //     }
    // }
    //
    // //this.props.selectedEvent就是上一个event，nextProps.selectedEvent为当前新触发的event
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.selectedEvent !== this.props.selectedEvent) {
    //         this.setState({
    //             event: nextProps.selectedEvent || emptyEvent
    //         })
    //     }
    // }

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


    // onFormSubmit = (evt) => {
    //
    //     //.preventDefault()用来prevent thisform actually sending ANY real data， 因为我们会在form中写一些东西，我们会点击submit来测试
    //     //但是我们不希望真正把这个test的input send给。。。
    //
    //     //createevent 这个参数是个function，它是由DASHBOARD传进来的，传给了component ，用props取
    //     evt.preventDefault();
    //
    //     //console.log(this.state.event);
    //
    //     //如果当前的event存在，则，我们用DASHBOARD传入的update event更新当前event，否则的话，就是 create一个event
    //     // 都是把form的event作为input 然后调用DASHboard中的function， 而这个event是根据render中的value，也就是你的form的input来决定的
    //     if (this.state.event.id) {
    //         this.props.updateEvent(this.state.event);
    //     } else {
    //         this.props.createEvent(this.state.event)
    //     }
    //
    // };


    // after redux
    //这时我们需要用cuid来create新的event id。不然你新建的form没有event ID。
    // onFormSubmit = (evt) => {
    //     evt.preventDefault();
    //
    //     //如果ID已经存在，则我们仅仅是update， 如果不存在，则我们要create event
    //     if (this.state.event.id) {
    //         this.props.updateEvent(this.state.event);
    //         // back TO the detail page
    //         this.props.history.goBack();
    //     } else {
    //
    //         //当你create event的时候，其他的你都可以手动写出，但是唯独ID和photo要特意加一下
    //         const newEvent = {
    //             ...this.state.event,
    //             id: cuid(),
    //             hostPhotoURL: '/assets/user.png'
    //         }
    //         this.props.createEvent(newEvent)
    //
    //         // 建好了event之后，我们就把它push到event list中。
    //         this.props.history.push('/events')
    //     }
    //
    // }
    //
    //
    // onInputChange = (evt) => {
    //     const newEvent = this.state.event;
    //     newEvent[evt.target.name] = evt.target.value;
    //     this.setState({
    //         event: newEvent
    //     })
    // };


  ////////////////////////////////////////////Google map API//////////////////////////////////////////////////

    handleScriptLoaded = () => this.setState({ scriptLoaded: true });

    //通过Google autocomplete选择了一个city。把input city 替换为选择的city。并且我们要记录这个city的经纬度
    //所以我们要调用geocodeByAddress的一些列callback function，把得到的经纬度update给state。
    //我们要得到city的经纬度，这样我们可以narrow venue的选择

    //this.props.change('city', selectedCity)，这个就是redux form 如何改变对应的input，把type输入，这样写 input就会变成selectedcity。
    //如果你不写这个，虽然你写了关键字，看到了下拉框，但是鼠标点，不work，因为你的input没法update
    handleCitySelect = selectedCity => {
        geocodeByAddress(selectedCity)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                this.setState({
                    cityLatLng: latlng
                });
            })
            .then(() => {
                this.props.change('city', selectedCity)
            })
    };

    handleVenueSelect = selectedVenue => {
        geocodeByAddress(selectedVenue)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                this.setState({
                    venueLatLng: latlng
                });
            })
            .then(() => {
                this.props.change('venue', selectedVenue)
            })
    };

/////////////////////////////////////////////////update  or create form///////////////////////////////////////////////////////////
    //redux form

    //这个value就是redux form，你input啥，它都给你记录成value
    // 注意这里 必须把VALIES.DATE转化为moment格式，不然redux不认
    //在使用fire store之后，我们就不用自己create  newevent了。我们用这个函数填表之后就会有个events，它就是values
    // 然后我们在里面调用 createeventactions， 把参数传入，就可以了， createeventactions里面有操作。
    // 我们会在actions 中deal with 时间。这里就不用了
    onFormSubmit = values => {

        values.venueLatLng = this.state.venueLatLng;
        if (this.props.initialValues.id) {
            if (Object.keys(values.venueLatLng).length === 0) {
                values.venueLatLng = this.props.event.venueLatLng
            }

            this.props.updateEvent(values);
            this.props.history.goBack();
        } else {
            //
            // const newEvent = {
            //     ...values,
            //     id: cuid(),
            //     hostPhotoURL: '/assets/user.png',
            //     hostedBy: 'Bob'

                this.props.createEvent(values);
                this.props.history.push('/events');
        }

    };

    ///////////////////////after FIRESTORE, 我们从fire store中取data////////////////////////////
    // async componentDidMount() {
    //     const {firestore, match} = this.props;
    //     await firestore.setListener(`events/${match.params.id}`);
    // }

    async componentDidMount() {
        const { firestore, match } = this.props;

        // 用.GET从fire store中取， 由于在eventlistitem中，我们设置了view button，把当前eventID 写在了路径了，这里用这个ID去firestore中找数据。
        // let event = await firestore.get(`events/${match.params.id}`);
        // if(event.exists) {
        //     this.setState({
        //         venueLatLng: event.data().venueLatLng
        //     })
        // }
         await firestore.setListener(`events/${match.params.id}`);
    }

    async componentWillUnmount() {
        const {firestore, match} = this.props;
        await firestore.unsetListener(`events/${match.params.id}`);
    }



    // render() {
    //     //由于handle cancel是由eventDASHBOARD中传入的，所以这里它不是state，而是props
    //     // 这里我们把event也deconstruct一下，是因为这样我们在render中，VALUE={this.STATE.event.title},可以简写了
    //     // 我们这里用state来获得event是因为我们用了control form。通过setstate来改变event的各种properties
    //
    //     // 关于日历，你写上type为date，则自动给你引入日历
    //    // const {handleCancel} = this.props;
    //     const {event} = this.state;
    //
    //     return (
    //         <Segment>
    //             <Form onSubmit={this.onFormSubmit}>
    //                 <Form.Field>
    //                     <label>Event Title</label>
    //                     <input name='title' onChange={this.onInputChange} value={event.title} placeholder="Event Title" />
    //                 </Form.Field>
    //                 <Form.Field>
    //                     <label>Event Date</label>
    //                     <input name='date' onChange={this.onInputChange} value={event.date} type="date" placeholder="Event Date" />
    //                 </Form.Field>
    //                 <Form.Field>
    //                     <label>City</label>
    //                     <input name='city' onChange={this.onInputChange} value={event.city} placeholder="City event is taking place" />
    //                 </Form.Field>
    //                 <Form.Field>
    //                     <label>Venue</label>
    //                     <input name='venue' onChange={this.onInputChange} value={event.venue} placeholder="Enter the Venue of the event" />
    //                 </Form.Field>
    //                 <Form.Field>
    //                     <label>Hosted By</label>
    //                     <input name='hostedBy' onChange={this.onInputChange} value={event.hostedBy} placeholder="Enter the name of person hosting" />
    //                 </Form.Field>
    //                 <Button positive type="submit">
    //                     Submit
    //                 </Button>
    //                 {/*<Button onClick={handleCancel} type="button">Cancel</Button>*/}
    //
    //                 {/*cancelbutton之前是什么都不做的，只是比关闭页面，而且还是在eventdashboard page上，现在我们令它返回上一个页面*/}
    //                 <Button onClick={this.props.history.goBack} type="button">Cancel</Button>
    //             </Form>
    //         </Segment>
    //     );
    // }



    // after redux form, 我们用field来代替， 它是 redux form自带的，它可以能够记录你的input的变化，直接在store里面更新
    // 所以我们什么都不用了，所有的input自动被field/REDUX FORM来track。
    // 对于每一个field，我们对于手动输入的部分 单独放在component中处理，因为涉及到输入是否valid的问题，component中的文件就是和手动输入的函数。
    // 主要就是handle 正常输入， 和触发了error之后怎么处理。
    render() {
        const {invalid, submitting, pristine, event, cancelToggle} = this.props;
        return (
            <Grid>

                {/*你这里必须先把script设好，把script的状态改为true，这样你的venue之类的才能show出来*/}

                <Script
                    url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBSw65gIWzeV2Em-taXsJZua2pudKI56dw&libraries=places"
                    onLoad={this.handleScriptLoaded}
                />

                <Grid.Column width={10}>
                    <Segment>
                        <Header sub color='teal' content='Event Details'/>

                        {/*这里this.props.handleSubmit，这时redux form method， 就这么写*/}
                        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                            <Field
                                name="title"
                                type="text"
                                component={TextInput}
                                placeholder="Give your event a name"
                            />
                            <Field
                                name="category"
                                type="text"
                                component={SelectInput}
                                // multiply={true}
                                options={category}
                                placeholder="What is your event about"
                            />
                            <Field
                                name="description"
                                type="text"
                                component={TextArea}
                                rows={3}
                                placeholder="Tell us about your event"
                            />

                            {/*Google map API*/}

                            {/*options： for autocomplete，所以city是个array，给你多种选择， cities是Google autocomplete自带的匹配，它还可以匹配国家，business等等*/}
                            {/*on select： 我们override Google autocomplete自带的on select function， 因为我们在选择了city的同时，我们要得到city的经纬度，这样我们可以narrow venue的选择*/}
                            <Header sub color="teal" content="Event Location details" />
                            <Field
                                name="city"
                                type="text"
                                component={PlaceInput}
                                options={{ types: ['(cities)'] }}
                                placeholder="Event city"
                                onSelect={this.handleCitySelect}
                            />


                            {/*establishments： Google autocomplete的关键字，就是business，自动给你匹配某地的商务地点*/}
                            {/*为了narrow venue的选择，我们在得到city的经纬度之后，我们要调用Google map的function，来generate一个location，然后搜索半径为1000米*/}
                            {/*我们要建立一个global variables for Google，放在文件顶部*/}
                             {/*这里需要set一下script， 其实我强烈怀疑他这里写重复了，他在placeinput里面已经check了 script的状态，其实这里不用设这个if条件*/}

                            {this.state.scriptLoaded &&
                            <Field
                                name="venue"
                                type="text"
                                component={PlaceInput}
                                options={{
                                    location: new google.maps.LatLng(this.state.cityLatLng),
                                    radius: 1000,
                                    types: ['establishment']
                                }}
                                placeholder="Event venue"
                                onSelect={this.handleVenueSelect}
                            />}

                            {/*时间格式必须是-， 不是/， 而且必须是string格式*/}
                            <Field
                                name="date"
                                type="text"
                                component={DateInput}
                                dateFormat='YYYY-MM-DD HH:mm'
                                timeFormat='HH:mm'
                                showTimeSelect
                                placeholder="Date and time of event"
                            />

                            {/*valid就是控制button的。如果有任何的error发生，则disable button， pristine就是空表单，或者没有做任何更改的form，不可以submit*/}
                            <Button disabled={invalid || submitting || pristine} positive type="submit">
                                Submit
                            </Button>
                            <Button onClick={this.props.history.goBack} type="button">
                                Cancel
                            </Button>

                            {/*toggle cancel*/}
                            <Button
                                onClick={() => cancelToggle(!event.cancelled, event.id)}
                                type='button'
                                color={event.cancelled ? 'green' : 'red'}
                                floated='right'
                                content={event.cancelled ? 'Reactivate Event' : 'Cancel Event'}
                            />
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}


//enableReinitialize: true 当你的props change了，例如你用其他的页面的button去调用 event form这个component，它会清空当前form，给你
//一个全新的空form
// export default connect(mapState, actions)(
//     reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(EventForm)
// );

export default withFirestore(
    connect(mapState, actions)(
        reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(
            EventForm
        )
    )
);


