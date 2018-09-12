import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import cuid from 'cuid';
import { asyncActionError, asyncActionStart, asyncActionFinish } from '../async/asyncActions'

/////////////////////////////////////////UPDATE PROFILE///////////////////////////////////////////////
// 我们使用constance，是因为我们直接用fire store或者firebase的reducer。
// 我们也要更新下user，这样才能把这个参数传给settingsdashboard
export const updateProfile = (user) =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const {isLoaded, isEmpty, ...updatedUser} = user;
        if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
            updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
        }

        try {
            await firebase.updateProfile(updatedUser);
            toastr.success('Success', 'Profile updated')
        } catch (error) {
            console.log(error)
        }
    }



/////////////////////////////////////////account settings：UPLOAD PHOTOS///////////////////////////////////////////////
    // 图片和图片的名字
// path：在fire store里面的storage的保存路径。
// imageName = cuid()：防止upload重复的图片，crop不同，set他们不同的名字，这样他们可以都显示。
export const uploadProfileImage = (file, fileName) => async (
    dispatch,
    getState,
    { getFirebase, getFirestore }
) => {
    const imageName = cuid();
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const path = `${user.uid}/user_images`;
    const options = {
        name: imageName
    };
    try {
        dispatch(asyncActionStart())
        // upload the file to fb storage
        let uploadedFile = await firebase.uploadFile(path, file, null, options);
        // get url of image
        let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
        // get the userdoc from firestore
        let userDoc = await firestore.get(`users/${user.uid}`);
        // check if user has photo, if not update profile
        if (!userDoc.data().photoURL) {

            //profile DOCUMENT UPDATE
            await firebase.updateProfile({
                photoURL: downloadURL
            });

            // AUTH profile update
            await user.updateProfile({
                photoURL: downloadURL
            });
        }
        // add the new photo to photos collection TO users database
        await firestore.add({
            collection: 'users',
            doc: user.uid,
            subcollections: [{collection: 'photos'}]
        }, {
            name: imageName,
            url: downloadURL
        })
        dispatch(asyncActionFinish())
    } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        throw new Error('Problem uploading photo')
    }
};



/////////////////////////////////////////account settings：DELETE PHOTOS///////////////////////////////////////////////
// photo name一定要unique
export const deletePhoto = (photo) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`)
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            })
        } catch (error) {
            console.log(error);
            throw new Error('Problem deleting the photo')
        }
    }


/////////////////////////////////////////account settings：SET MAIN PHOTO///////////////////////////////////////////////
export const setMainPhoto = photo =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        try {
            return await firebase.updateProfile({
                photoURL: photo.url
            })
        } catch (error) {
            console.log(error);
            throw new Error('Problem setting main photo')
        }
    }



/////////////////////////////////////////login user as attendee///////////////////////////////////////////////
// current user as attendee
export const goingToEvent = (event) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        const attendee = {
            going: true,
            joinDate: Date.now(),
            photoURL: photoURL || '/assets/user.png',
            displayName: user.displayName,
            host: false
        }
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: attendee
            })
            await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host: false
            })
            toastr.success('Success', 'You have signed up to the event');
        } catch (error) {
            console.log(error);
            toastr.error('Oops', 'Problem signing up to event')
        }
    }

export const cancelGoingToEvent = (event) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: firestore.FieldValue.delete()
            })
            await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
            toastr.success('Success', 'You have removed yourself from the event');
        } catch (error) {
            console.log(error)
            toastr.error('Oops', 'something went wrong')
        }

    }