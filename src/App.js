import styles from './App.module.css';
import GamePage from './components/GamePage';
import LobbyPage from './components/LobbyPage'
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import NotFoundPage from './components/NotFoundPage';

function App() {
  return (
    <div className={styles.Container}>
      <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        <Switch>
          <Route path='/' exact component={LobbyPage} />
          <Route path={process.env.REACT_APP_LOBBYPAGE_URL} exact component={LobbyPage} />
          <Route path={process.env.REACT_APP_GAMEPAGE_URL + `/:lobbyCode`} exact component={GamePage}/>
          <Route path="*" component={NotFoundPage}/>
          <Route path="/404" component={NotFoundPage}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
