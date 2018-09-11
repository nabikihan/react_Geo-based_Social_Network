import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from './app/store/configureStore';
import ReduxToastr from 'react-redux-toastr'
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import ScrollToTop from './app/common/util/ScrollToTop';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';
//import { loadEvents } from './features/event/eventActions'

/////////////////store//////////////////////////////
//我们用 store来dispatch loadevents这个function。这样当我们 LOAD我们的app的时候，events也会被LOAD .
// 这个loadevents这个function在eventaction里。有了firebase之后，我们把它移除掉
const store = configureStore();
//store.dispatch(loadEvents())



//我们要用 HOT module, 路径是你的总app
const rootEl = document.getElementById('root');

let render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop>
                    <ReduxToastr
                        position='bottom-right'
                        transitionIn='fadeIn'
                        transitionOut='fadeOut'
                    />
                    <App />
                </ScrollToTop>
            </BrowserRouter>
        </Provider>,
        rootEl
    );
};

if (module.hot) {
    module.hot.accept('./app/layout/App', () => {
        setTimeout(render)
    })
}

//render();
// make SURE我们的render在firebase authentication之前不会take place
store.firebaseAuthIsReady.then(() => {
    render();
    registerServiceWorker();
})

//这个的意思就是， 你在app中写的东西会代替root show出来。当我们用了HOT module之后，就不用这个了
//ReactDOM.render(<App />, document.getElementById('root'));

