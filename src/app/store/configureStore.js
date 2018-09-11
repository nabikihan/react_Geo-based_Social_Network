import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import firebase from '../config/firebase';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';


/////////////////firebase/firestore////////////////////////////////

// userProfile: tell firebase where we store users information
// attachAuthIsReady: 我们要用firebase来做authentication，因此我们需要知道 AUTH什么时候available
// useFirestoreForProfile: 写了这个 user的信息就会被存入fire store，不然的话 default是存入firebase
// updateProfileOnLogin：这个就是可以控制sociallogin 的 二次login。例如你第一个用谷歌login了，在firestore中create一个用户，用户信息如你所愿
// 按照AUTHactions中只显示你挑选的三个选项，当你再次用同样的谷歌账户login时，如果你不用这个flag，则你会发现，它会往fire store里面加入很多的
// 上次你filter掉的信息。这是因为，你在actions中设置的filter的条件不适用了，所以它就开始加乱七八糟的其他信息，所以这里我们设一个boolean，让它相同账户
//不更新。
const rrfConfig = {
    userProfile: 'users',
    attachAuthIsReady: true,
    useFirestoreForProfile: true,
    updateProfileOnLogin: false
};


////////////////////////////加了 FIREBASE  FIRESTORE之前和之后的对比/////////////////////////////////////
export const configureStore = (preloadedState) => {
    // const middlewares = [thunk];
    // const middlewareEnhancer = applyMiddleware(...middlewares);
    //
    // const storeEnhancers = [middlewareEnhancer];
    //
    // const composedEnhancer  = composeWithDevTools(...storeEnhancers);
    //

    const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const storeEnhancers = [middlewareEnhancer];

    const composedEnhancer = composeWithDevTools(
        ...storeEnhancers,
        reactReduxFirebase(firebase, rrfConfig),
        reduxFirestore(firebase)
    );

    const store = createStore(rootReducer, preloadedState, composedEnhancer);


////////////////////////////////不变/////////////////////////////////
    if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
            module.hot.accept('../reducers/rootReducer', () => {
                const newRootReducer = require('../reducers/rootReducer').default;
                store.replaceReducer(newRootReducer)
            })
        }
    }

    return store;
};