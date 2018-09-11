import React from 'react';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { login, socialLogin } from '../authActions'
import SocialLogin from '../SocialLogin/SocialLogin'

const actions = {
    login,
    socialLogin
}


// handlesubmit 是redux form的props的一个自带function，见event form页面，我们提过。
//??? error 从哪里来， 应该是LOGIN actions里的error 存入了state，取出来的？？？
// 没有mapstate是因为 login actions没有state上的变化，仅仅是让firebase login 或者 post出error
const LoginForm = ({login, handleSubmit, error, socialLogin}) => {
    return (
        <Form size="large" onSubmit={handleSubmit(login)}>
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

                {/*见AUTH actions，那里负责CatCH error，你这里负责render*/}
                {error && <Label basic color='red'>{error}</Label>}
                <Button fluid size="large" color="teal">
                    Login
                </Button>

                <Divider horizontal>Or</Divider>

                {/*这里如果你选择了sociallogin，则会被导入social login页面，并且调用actions来完成*/}
                <SocialLogin socialLogin={socialLogin}/>
            </Segment>
        </Form>
    );
};

// NULL是指 map state。我们这里没有用到 只是直接调用了action来关闭modal， 所以我们的第一个input为NULL
export default connect(null, actions)(reduxForm({form: 'loginForm'})(LoginForm));