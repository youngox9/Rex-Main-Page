import React, { createContext, useEffect } from 'react';
import 'reset-css';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Gallery from '~~containers/Gallery';
import Main from '~~containers/Main';
import Store from '~~src/Store';

import '~~styles/style.scss';
import 'swiper/swiper.scss';

function App() {
  return (
    <Store>
      <Router>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/gallery">
            <Gallery />
          </Route>
        </Switch>
      </Router>
    </Store>
  );
}

export default App;
