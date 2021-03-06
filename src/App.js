import styles from './App.module.css';
import GamePage from './components/GamePage';
import MobilePage from './components/MobilePage';
import LobbyPage from './components/LobbyPage'
import {Switch, Route, HashRouter} from 'react-router-dom'
import { BrowserView, MobileView } from 'react-device-detect';
import ErrorPage from './components/ErrorPage';
import React from 'react';

function App() {
  return (
    <div className={styles.Container}>
      <BrowserView>
        <HashRouter>
          <Switch>
            <Route path='/' exact component={LobbyPage} />
            <Route path={process.env.REACT_APP_LOBBYPAGE_URL} exact component={LobbyPage} />
            <Route path={process.env.REACT_APP_GAMEPAGE_URL} exact component={GamePage}/>
            <Route path="*" component={() => <ErrorPage>404 Page not found</ErrorPage>}/>
          </Switch>
        </HashRouter>
      </BrowserView>
      <MobileView>
        <MobilePage/>
      </MobileView>
    </div>
  );
}

export default App;
