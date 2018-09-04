import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';

//我们要用 HOT module, 路径是你的总app
const rootEl = document.getElementById('root');

let render = () => {
    ReactDOM.render(<App />, rootEl)
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
