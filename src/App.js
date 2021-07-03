import styles from './App.module.css';
import GamePage from './components/GamePage';
import LobbyPage from './components/LobbyPage'
import {Switch, Route, HashRouter} from 'react-router-dom'
import ErrorPage from './components/ErrorPage';

function App() {
  return (
    <div className={styles.Container}>
      <HashRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        <Switch>
          <Route path='/' exact component={LobbyPage} />
          <Route path={process.env.REACT_APP_LOBBYPAGE_URL} exact component={LobbyPage} />
          <Route path={process.env.REACT_APP_GAMEPAGE_URL} exact component={GamePage}/>
          <Route path="*" component={() => <ErrorPage>404 Page not found</ErrorPage>}/>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
