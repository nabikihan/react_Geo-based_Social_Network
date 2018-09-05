import React, { Component } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';

class NavBar extends Component {
    state = {
        authenticated: false
    };

    handleSignIn = () => {
        this.setState({
            authenticated: true
        });
    };

    handleSignOut = () => {
        this.setState({
            authenticated: false
        });
        this.props.history.push('/')
    };

    render() {
        //如果AUTH了，则显示sign out ， 没有AUTH 则显示signin
        //如果AUTH了，则显示people朋友 以及event ， 没有AUTH 则不显示这些私人相关的
        const { authenticated } = this.state;
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
                    {authenticated ? (
                        <SignedInMenu signOut={this.handleSignOut} />
                         ) : (
                        <SignedOutMenu signIn={this.handleSignIn} />
                    )}
                </Container>
            </Menu>
        );
    }
}



//HOC ， with router，这样NAV BAR就有了router的属性，而且它就有了props history的属性
//不然的话，你的NAV BAR上面的button/LINK 都不work
export default withRouter(NavBar);