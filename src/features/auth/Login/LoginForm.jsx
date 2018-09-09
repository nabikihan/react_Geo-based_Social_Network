import React from 'react';
import { Form, Segment, Button } from 'semantic-ui-react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { login } from '../authActions'

const actions = {
    login
}


// handlesubmit 是redux form的props的一个自带function，见event form页面，我们提过。
const LoginForm = ({login, handleSubmit}) => {
    return (
        <Form error size="large" onSubmit={handleSubmit(login)}>
            <Segment>
                <Field
                    name="email"
                    component={TextInput}
                    type="text"
                    placeholder="Email Address"
                />
                <Field
                    name="password"
                    component={TextInput}
                    type="password"
                    placeholder="password"
                />
                <Button fluid size="large" color="teal">
                    Login
                </Button>
            </Segment>
        </Form>
    );
};

// NULL是指 map state。我们这里没有用到 只是直接调用了action来关闭modal， 所以我们的第一个input为NULL
export default connect(null, actions)(reduxForm({form: 'loginForm'})(LoginForm));