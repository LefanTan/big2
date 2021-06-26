import styles from './App.module.css';
import Deck from './Deck';
import Player from './Player.js'

function App() {
  return (
    <div className={styles.Container}>
      {/* Turn this into a component with ability to change rotation, orientation */}
      <Player playerNo='1'>Player1</Player>
      <Player playerNo='2'>Player2</Player>
      <Player playerNo='3'>Player3</Player>
      <Player playerNo='4'>Player4</Player>
      <Deck/>
    </div>
  );
}

export default App;
