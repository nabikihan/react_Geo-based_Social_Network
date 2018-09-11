import React, { Component } from 'react';
import { Segment, Form, Header, Divider, Button } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import TextInput from '../../../app/common/form/TextInput';
import RadioInput from '../../../app/common/form/RadioInput';

class BasicPage extends Component {
    render() {
        const { pristine, submitting, handleSubmit, updateProfile } = this.props;
        return (
            <Segment>
                <Header dividing size="large" content="Basics" />
                <Form onSubmit={handleSubmit(updateProfile)}>
                    <Field
                        width={8}
                        name="displayName"
                        type="text"
                        component={TextInput}
                        placeholder="Known As"
                    />
                    <Form.Group inline>
                        <label>Gender: </label>
                        <Field
                            name="gender"
                            type="radio"
                            value="male"
                            label="Male"
                            component={RadioInput}
                        />
                        <Field
                            name="gender"
                            type="radio"
                            value="female"
                            label="Female"
                            component={RadioInput}
                        />
                    </Form.Group>
                    <Field
                        width={8}
                        name="dateOfBirth"
                        component={DateInput}
                        dateFormat='YYYY-MM-DD'
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        dropdownMode='select'
                        maxDate={moment().subtract(18, 'years')}
                        placeholder="Date of Birth"
                    />
                    <Field
                        name="city"
                        placeholder="Home Town"
                        options={{ types: ['(cities)'] }}
                        label="Female"
                        component={PlaceInput}
                        width={8}
                    />
                    <Divider />
                    <Button
                        disabled={pristine || submitting}
                        size="large"
                        positive
                        content="Update Profile"
                    />
                </Form>
            </Segment>
        );
    }
}


// enableReinitialize: 这个的意思就是当你refresh这个basicpage页面，你的initial占位input 仍然在那里。
// destroyOnUnmount: 由于你用redux form在这些form，他们的名称都是一样的，所以redux form认为他们应该是一样的表单。所以当你填完了表，save 之后，你在这些表单之间转换，redux form会自动
//   destroy不能match 的form，所以你看不到你已经输入的文字。我们把这个设为false，这样redux就不会match了，这样你就可以保存天国的表单数据了。

//...发现如果把basic page和about page两个表单的名字改为不一样，根本不需要destroyOnUnmount这个function， 不知道为啥老师多次一举。。。
export default reduxForm({ form: 'userProfile', enableReinitialize: true, destroyOnUnmount: false })(
    BasicPage
);