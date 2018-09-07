import React, { Component } from 'react';
import {Container} from 'semantic-ui-react';
import {Route, Switch} from 'react-router-dom';

import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import NavBar from '../../features/nav/NavBar/NavBar';
import EventForm from '../../features/event/EventForm/EventForm';
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard';
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage';
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard';
import EventDetailedPage from '../../features/event/EventDetailed/EventDetailedPage';
import HomePage from '../../features/home/HomePage';



class App extends Component {
  render() {
    return (
      <div>
        {/*这个container就像是bootstrap里的，把内容在里面打包，然后就可以把内容更好更规范的show出来*/}
        {/*switch就是为了防止这些页面一起show 出来*/}
        {/*这里我们写了一个判断条件，如果path能够exact match homepage，则显示homepage，否则的话，则看/后面有啥，然后对应match*/}

          <Switch>
              <Route exact path="/" component={HomePage} />
          </Switch>

          <Route
              path="/(.+)"
              render={() => (
                  <div>
                      <NavBar />
                      <Container className="main">
                          <Switch>
                              <Route path="/events" component={EventDashboard} />
                              <Route path="/event/:id" component={EventDetailedPage} />
                              <Route path="/manage/:id" component={EventForm} />
                              <Route path="/people" component={PeopleDashboard} />
                              <Route path="/profile/:id" component={UserDetailedPage} />
                              <Route path="/settings" component={SettingsDashboard} />
                              <Route path="/createEvent" component={EventForm} />
                          </Switch>
                      </Container>
                  </div>
              )}
          />
      </div>
    );
  }
}

export default App;


