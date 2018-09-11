import { SubmissionError, reset } from 'redux-form'
//import { LOGIN_USER, SIGN_OUT_USER } from './authConstants';
import { closeModal } from '../modals/modalActions'
import { toastr } from 'react-redux-toastr'




////////////////////////////////////////login//////////////////////////////////////////////////
// 这里需要credential: email, password
// 这里我们不需要再次import firebase，因为我们只要把getFirebase作为一个ARGU传入就可以用firebase的相关函数了
// 思路就是，我们先要用一个参数来表示firebase 函数，这样我们就可以使用firebase了。
// 所以 我们先去login，去signin with credentials，成功了之后（所以这里我们用了异步），我们关闭modal。（dispatch close modal这个动作给modalactions）
// 如果出错，则我们把错误信息显示出来。

//redux form提供功能让你显示error。然后我们要去login form中，把error展示出来。 ？？？这时error就能作为一个参数被存入state？or props？？？
export const login = (creds) => {
    return async (dispatch, getState, {getFirebase})=> {
        const firebase = getFirebase();
        try {
            await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
            dispatch(closeModal())
        } catch (error) {
            console.log(error);
            throw new SubmissionError({
                _error: 'Login failed'
            })
        }
    }
}

//有了firebase logout之后，我们就不需要用actions来logout了，直接在NAV BAR 里面使用fir base的function。
// export const logout = () => {
//     return {
//         type: SIGN_OUT_USER
//     }
// }

////////////////////////////////////////register//////////////////////////////////////////////////
// register的化，我们既需要firebase（authenticATION）也需要fire stor（for user profile）
// 我们这里用ASYNC AWAIT来写，没有用promise写，因为promise你要写个chain，太麻烦。
// 写完了之后去register form
export const registerUser = (user) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        try {
            //1. create the user in firebase auth
            // 这里是个异步，因为我们要先等firebase create结束，才能进行下一步。 firebase会create一个新用户，根据你输入的email和密码
            // 然后它还会赋予userID等等其他的信息，自动生成。
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            console.log(createdUser);


            // 2. update the auth profile
            //之前都是email，我们也要输入个名字啊，因为我们的fire store对于用户的设置就是名字，email
            await createdUser.updateProfile({
                displayName: user.displayName
            })


            // 3. create a new profile in firestore
            // 这里我们使用serverTimestamp，为了KEEP OUR DATA consistent because itwill use the server value instead OF
            // local value（where the current user is）
            let newUser = {
                displayName: user.displayName,
                createdAt: firestore.FieldValue.serverTimestamp()
            }

            //这里都是fire store的自带function，.ADD（）是可以让fire store自动generate ID ， 但是我们已经通过firebase AUTH 产生了
            // 一套user profile，已经有ID 了，所以我们用.SET(), 也就是说我们把当前的userID set成为fire store的documentID ,同时，我们把这个
            // new user加进去，fire store就会自动为我们create 新用户了。注意，这个firestore的路径，说明你是在users的collection下面建立的这个new用户
            // 而这个userS关键字，是我们在store里面规定的。
            await firestore.set(`users/${createdUser.uid}`, {...newUser})
            dispatch(closeModal());


        } catch (error) {
            console.log(error)
            throw new SubmissionError({
                _error: error.message
            })
        }
    }


////////////////////////////////////////facebook or google login//////////////////////////////////////////////////
//
export const socialLogin = (selectedProvider) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        //先close modal，因为如果你click了 social login，你就会去Google或者Facebook页面去login了，而不用你当前的modal。
        // pop up： 让FACEBOOK LOGIN 或者谷歌login是个POP up window的形式
        // AVATARURL: 就是使用Google或者 Facebook的账户的头像link。

        // 还有一个问题就是，这些代码第一次login的时候没问题，但是再次login，它就会ignore 这个filter 条件，还会把乱七八糟的信息加入fire store，所以我们在store中设一个 boolean。
        try {
            dispatch(closeModal());
            let user = await firebase.login({
                provider: selectedProvider,
                type: 'popup'
            })
            if (user.additionalUserInfo.isNewUser) {
                await firestore.set(`users/${user.user.uid}`, {
                    displayName: user.profile.displayName,
                    photoURL: user.profile.avatarUrl,
                    createdAt: firestore.FieldValue.serverTimestamp()
                })
            }
        } catch (error) {
            console.log(error)
        }
    }


////////////////////////////////////////account management -- update password//////////////////////////////////////////////////
//   其中， user.updatePassword（），是firebase的函数
// reset： reset all the field TO current form  -- redux form的函数。
export const updatePassword = (creds) =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        try {
            await user.updatePassword(creds.newPassword1);
            await dispatch(reset('account'));
            toastr.success('Success', 'Your password has been updated')
        } catch (error) {
            throw new SubmissionError({
                _error: error.message
            })
        }
    }