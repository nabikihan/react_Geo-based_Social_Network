import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from './app/store/configureStore';

import 'semantic-ui-css/semantic.min.css';
import ScrollToTop from './app/common/util/ScrollToTop';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';

/////////////////store//////////////////////////////
const store = configureStore();




//我们要用 HOT module, 路径是你的总app
const rootEl = document.getElementById('root');

let render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop>
                    <App />
                </ScrollToTop>
            </BrowserRouter>
        </Provider>, rootEl)
}

if (module.hot) {
    module.hot.accept('./app/layout/App', () => {
        setTimeout(render)
    })
}

render();

//这个的意思就是， 你在app中写的东西会代替root show出来。当我们用了HOT module之后，就不用这个了
//ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
