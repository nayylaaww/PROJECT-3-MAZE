import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MazeGame from './components/MazeGame';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import LeaderboardPage from './components/LeaderboardPage';
import RotateWarning from './components/RotateWarning'; 

function App() {
  return (
    <>
      <RotateWarning /> 
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/play' element={<MazeGame />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
