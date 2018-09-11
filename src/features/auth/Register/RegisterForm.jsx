import React from 'react';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { combineValidators, isRequired } from 'revalidate'

import { registerUser, socialLogin } from '../authActions'
import { connect } from 'react-redux'
import SocialLogin from '../SocialLogin/SocialLogin'


// 在firebase fire store中添加新用户。
const actions = {
    registerUser,
    socialLogin
}

// 规划一下input，validate一下，这些必须填写。
const validate = combineValidators({
    displayName: isRequired('displayName'),
    email: isRequired('email'),
    password: isRequired('password')
})


// submitting等等，这些都是redux form props自带的。
const RegisterForm = ({registerUser, handleSubmit, error, invalid, submitting}) => {
    return (
        <div>
            <Form size="large" onSubmit={handleSubmit(registerUser)}>
                <Segment>
                    <Field
                        name="displayName"
                        type="text"
                        component={TextInput}
                        placeholder="Known As"
                    />
                    <Field
                        name="email"
                        type="text"
                        component={TextInput}
                        placeholder="Email"
                    />
                    <Field
                        name="password"
                        type="password"
                        component={TextInput}
                        placeholder="Password"
                    />
                    {error && <Label basic color='red'>{error}</Label>}
                    <Button disabled={invalid || submitting} fluid size="large" color="teal">
                        Register
                    </Button>
                    <Divider horizontal>Or</Divider>
                    <SocialLogin/>
                </Segment>
            </Form>
        </div>
    );
};



//export default reduxForm({form: 'registerForm'})(RegisterForm);

export default connect(null, actions)(reduxForm({form: 'registerForm', validate})(RegisterForm));


