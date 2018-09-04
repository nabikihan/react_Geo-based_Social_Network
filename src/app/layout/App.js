import React, { Component } from 'react';
import {Container} from 'semantic-ui-react';
import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import NavBar from '../../features/nav/NavBar/NavBar';

class App extends Component {
  render() {
    return (
      <div>
          <NavBar/>

        {/*这个container就像是bootstrap里的，把内容在里面打包，然后就可以把内容更好更规范的show出来*/}
        <Container className="main">
             <EventDashboard/>
        </Container>
      </div>
    );
  }
}

export default App;


