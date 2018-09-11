import React from 'react';
import { Button, Icon } from 'semantic-ui-react';


// 从 login form/ register form中取出 social login的参数。但实际上这个参数是个action，他在login form中是个action
const SocialLogin = ({socialLogin}) => {
    return (
        <div>
            <Button

                // ON CLICK : 会产生一个pop up window for Facebook login，这里是和 sociallogin action相对应的。
                // 这个Facebook就是select provider
                onClick={() => socialLogin('facebook')}
                type="button"
                style={{ marginBottom: '10px' }}
                fluid
                color="facebook"
            >
                <Icon name="facebook" /> Login with Facebook
            </Button>

            <Button onClick={() => socialLogin('google')} type="button" fluid color="google plus">
                <Icon name="google plus" />
                Login with Google
            </Button>
        </div>
    );
};

export default SocialLogin;