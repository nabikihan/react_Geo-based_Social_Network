import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux'
import UserDetailedHeader from './UserDetailedHeader'
import UserDetailedDescription from './UserDetailedDescription'
import UserDetailedPhotos from './UserDetailedPhoto'
import UserDetailedSidebar from './UserDetailedSidebar'
import UserDetailedEvents from './UserDetailedEvents'
import { userDetailedQuery } from '../userQueries'
import LoadingComponent from '../../../app/layout/LoadingComponent'

// 我们把query部分移到userqueries中写
// const query = ({auth}) => {
//     return [
//         {
//             collection: 'users',
//             doc: auth.uid,
//             subcollections: [{collection: 'photos'}],
//             storeAs: 'photos'
//         }
//     ]
// }

// const mapState = (state) => ({
//     profile: state.firebase.profile,
//     auth: state.firebase.auth,
//     photos: state.firestore.ordered.photos
// })

// 对比之前的写法，之前只是展示current login user的内容，也就是无论是哪个attendee，都是展示login 的user信息
//所以现在我们写成：
const mapState = (state, ownProps) => {
    let userUid = null;
    let profile = {};

    // 如果是当前的login user，则展示login user的信息，
    // 如果不是，则看fire store中的profile里是谁，则取出来， 这里的判断条件就是确保 fire store不为空，所以要 check index为0的情况。
    // state.firestore.ordered.profile[0]： 因为当前的profile array里面只有你自己。你用redux inspect一看就发现了
    // ownProps.match.params.id： 从URL中取出的userID
    if (ownProps.match.params.id === state.auth.uid) {
        profile = state.firebase.profile
    } else {
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
        userUid = ownProps.match.params.id;
    }
    return {
        profile,
        userUid,
        auth: state.firebase.auth,
        photos: state.firestore.ordered.photos,
        requesting: state.firestore.status.requesting
    }
}


class UserDetailedPage extends Component {
    render() {
        const {profile, photos, auth, match, requesting} = this.props;
        const isCurrentUser = auth.uid === match.params.id;
        const loading = Object.values(requesting).some(a => a === true);

        if (loading) return <LoadingComponent inverted={true}/>
        return (
            <Grid>
                <UserDetailedHeader profile={profile}/>
                <UserDetailedDescription profile={profile}/>
                <UserDetailedSidebar isCurrentUser={isCurrentUser}/>
                {photos && photos.length > 0 &&
                <UserDetailedPhotos photos={photos}/>}
                <UserDetailedEvents/>
            </Grid>
        );
    }
}

// export default compose(
//     connect(mapState),
//     firestoreConnect(auth => query(auth)),
// )(UserDetailedPage);

export default compose(
    connect(mapState),
    firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid)),
)(UserDetailedPage);