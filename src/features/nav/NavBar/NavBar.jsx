import React, { Component } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions'
import { logout } from '../../auth/authActions'

import { connect } from 'react-redux'


const actions = {
    openModal,
    logout
}

const mapState = (state) => ({
    auth: state.auth
})

class NavBar extends Component {

/////////////////////////////////////////modal///////////////////////////////////////////////
    // 调用modalaction中的 open modal需要把modal type传入,这里的写法要和modal manager对应
    handleSignIn = () => {
        this.props.openModal('LoginModal')
    };

    handleRegister = () => {
        this.props.openModal('RegisterModal')
    }

    handleSignOut = () => {
        this.props.logout();
        this.props.history.push('/')
    };

    render() {
        //如果AUTH了，则显示sign out ， 没有AUTH 则显示signin
        //如果AUTH了，则显示people朋友 以及event ， 没有AUTH 则不显示这些私人相关的

        //这里的authenticATED 是 AUTH reducer中点名要改变的一个boolean，
        const { auth} = this.props;
        const authenticated = auth.authenticated;

        return (
            <Menu inverted fixed="top">
                <Container>
                    <Menu.Item as={Link} to="/" header>
                        <img src="/assets/logo.png" alt="logo" />
                        Re-vents
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/events" name="Events" />
                    {authenticated &&
                    <Menu.Item as={NavLink} to="/people" name="People" />}

                    {authenticated &&
                    <Menu.Item>
                        <Button
                            as={Link}
                            to="/createEvent"
                            floated="right"
                            positive
                            inverted
                            content="Create Event"
                        />
                    </Menu.Item>}

                    {/*两个modal*/}
                    {authenticated ? (
                        <SignedInMenu currentUser={auth.currentUser} signOut={this.handleSignOut}  />
                         ) : (
                        <SignedOutMenu register={this.handleRegister} signIn={this.handleSignIn} />
                    )}
                </Container>
            </Menu>
        );
    }
}



//HOC ， with router，这样NAV BAR就有了router的属性，而且它就有了props history的属性
//不然的话，你的NAV BAR上面的button/LINK 都不work

export default withRouter(connect(mapState, actions)(NavBar));