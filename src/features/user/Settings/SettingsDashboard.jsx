import React from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom'
import SettingsNav from './SettingsNav'
import AboutPage from './AboutPage'
import PhotosPage from './PhotosPage'
import AccountPage from './AccountPage'
import BasicPage from './BasicPage'
import { updatePassword } from '../../auth/authActions';
import { updateProfile } from '../userActions'


const actions = {
    updatePassword,
    updateProfile
};

const mapState = (state) => ({
    // 见redux inspection中的firebase的数据存储格式。
    // 我们要确保firebase的AUTH run了之后，灿能调用这个函数，所以我们去index.JS , 在render的时候加一个条件。
    providerId: state.firebase.auth.providerData[0].providerId,
    user: state.firebase.profile
})

// 我们从store中取出 updatepassword（actions中，这是个参数，不是函数） 和providerId
const SettingsDashboard = ({ updatePassword, providerId, user, updateProfile }) => {

    // redirect这个的意思就是，无论合适我们hit setting这个button，都会被redirect到basic page
    // initialvalues: 就是每个path都会render一个表单，其中有起始占位的，是当前的user，然后你可以更改啊之类的。
    return (
        <Grid>
            <Grid.Column width={12}>
                <Switch>
                    <Redirect exact from="/settings" to="/settings/basic" />
                    <Route path="/settings/basic" render={() => <BasicPage updateProfile={updateProfile} initialValues={user}/>} />
                    <Route path="/settings/about" render={() => <AboutPage updateProfile={updateProfile} initialValues={user}/>} />
                    <Route path='/settings/photos' component={PhotosPage}/>
                    <Route
                        path="/settings/account"
                        render={() => <AccountPage updatePassword={updatePassword} providerId={providerId} />}
                    />
                </Switch>
            </Grid.Column>

            <Grid.Column width={4}>
                <SettingsNav/>
            </Grid.Column>
        </Grid>
    )
}

export default connect(mapState, actions)(SettingsDashboard);