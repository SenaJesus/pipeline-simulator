import './App.css';
import Datapath from './components/dataṕath/datapath';
import NavBar from './components/navbar/navbar';
import { Box, Grid, Typography,Button } from '@mui/material';

const App = () => {
  return (
    <main style={{ height: '100vh', width: '100vw' }} >
      <NavBar />
      <Datapath />
    </main>
  );
}

export default App;
