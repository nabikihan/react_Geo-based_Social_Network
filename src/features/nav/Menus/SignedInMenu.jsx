import React from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

// signin 下一步就是sigh out，所以要把signout参数传入
// after 我们在NAV BAR中使用firebase，我们的参数就变成了AUTH, 而不是user了。
// 最后，我们希望NAVBAR展示的是username，而不是email， 规定见AUTH ACTIONS
const SignedInMenu = ({signOut, profile, auth}) => {
    return (
        <Menu.Item position="right">
            <Image avatar spaced="right" src={profile.photoURL || "/assets/user.png"} />
            {/*login之后，把经过AUTH 检验的email显示在右上角*/}
            <Dropdown pointing="top left" text={profile.displayName}>
                <Dropdown.Menu>
                    <Dropdown.Item text="Create Event" icon="plus" />
                    <Dropdown.Item text="My Events" icon="calendar" />
                    <Dropdown.Item text="My Network" icon="users" />
                    <Dropdown.Item as={Link} to={`/profile/${auth.uid}`} text="My Profile" icon="user" />
                    <Dropdown.Item as={Link} to='/settings' text="Settings" icon="settings" />
                    <Dropdown.Item onClick={signOut} text="Sign Out" icon="power" />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
    );
};

export default SignedInMenu;