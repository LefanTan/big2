import styles from './App.module.css';

function App() {
  return (
    <div className={styles.Container}>
      <div className={styles.Player1}>
        <p>Player1</p>
      </div>
      <div className={styles.Player2}>
        <p>Player2</p>
      </div>
      <div className={styles.Player3}>
        <p>Player3</p>
      </div>
      <div className={styles.Player4}>
        <p>Player4</p>
      </div>
      <div className={styles.Deck}>
        <p>Deck</p>
      </div>
    </div>
  );
}

export default App;
