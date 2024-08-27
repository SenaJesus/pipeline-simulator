import './App.css';
import Datapath from './components/dataṕath/datapath';
import NavBar from './components/navbar/navbar';
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <main style={{ display: 'flex', flexDirection: 'column' }} >
        <NavBar />
        <Datapath />
        <footer style={{ backgroundColor: '#ffdb74', textAlign: 'center', userSelect: 'none' }}>Jesus Sena, Letícia Raddatz, Bruno Yamato e Tiago Bezerra</footer>
      </main>
    </SnackbarProvider>
  );
}

export default App;
