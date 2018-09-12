import React, { Component } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions'
import { withFirebase } from 'react-redux-firebase'
import { connect } from 'react-redux'


const actions = {
    openModal
}

// 我们要import firebase，因为我们要使用firebase的相关函数来实现logout。
const mapState = (state) => ({
    //auth: state.auth
   // 在使用了firebase之后，我们就从firebase 中取AUTH相关的东西
    //在AUTHactions中， 我们把user的信息存在profile中， 我们把它拿出来的目的就是为了login之后在NAV BAR上展示username 而不是email。
    auth: state.firebase.auth,
    profile: state.firebase.profile
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

    // firebase自带logout功能。当我们使用了hOC之后，firebase就会被加入到props中，就可以这么调用了。
    // 你去INSPECT REDUX中 check，你logout之后，它的AUTH状态全部变为false了。
    handleSignOut = () => {
        this.props.firebase.logout();
        this.props.history.push('/')
    };

    render() {
        //如果AUTH了，则显示sign out ， 没有AUTH 则显示signin
        //如果AUTH了，则显示people朋友 以及event ， 没有AUTH 则不显示这些私人相关的

        //这里的authenticATED 是 AUTH reducer中点名要改变的一个boolean，
        const { auth, profile} = this.props;

        //const authenticated = auth.authenticated;
        // after firebase logout, check IF our status is authentic。这里函数的调用都是自带的，你可以去 页面 inspect react 搜索一下。
        const authenticated = auth.isLoaded && !auth.isEmpty;

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
                    {/*我们把AUTH 的情况 pass给signedin user，然后我们去SIGNEDIN MENU文件*/}
                    {/*在AUTH之后，我们要展示username，而不是 email，所以这里把 profile传入*/}
                    {authenticated ? (
                        <SignedInMenu auth={auth} profile={profile} signOut={this.handleSignOut}  />
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

// 使用firebase来 logout
export default withRouter(withFirebase(connect(mapState, actions)(NavBar)));