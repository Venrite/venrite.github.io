import './App.css';
import LoginButton from './buttons/LoginButton';
import LogoutButton from './buttons/LogoutButton';
import Profile from './buttons/Profile';
import GamePage from './buttons/GamePage';
import { Route, Routes } from 'react-router-dom';

const image = new URL("../assets/img-removebg-preview-PhotoRoom.png", import.meta.url);
const meteor = new URL("../public/vanilla/assets/meteor.png", import.meta.url);

const GameLayout = ({ children }) => {
  return (
    <div className="game-layout">
      {children}
    </div>
  );
};

function App() {
  
  const meteorStyles = [
    { left: '500px', top: '50px', animationDuration: '5s', width: '15vh' },
    { right: '250px', top: '300px', animationDuration: '4s', width: '20vh' },
    { left: '350px', top: '200px', animationDuration: '3s', width: '10vh' },
    { left: '100px', top: '89vh', animationDuration: '3s', width: '10vh' },
    { left: '100px', top: '5vh', animationDuration: '3s', width: '10vh' },
    { left: '700px', top: '65vh', animationDuration: '2s', width: '15vh' },
    { left: '1300px', top: '75vh', animationDuration: '1s', width: '10vh' },
    { left: '1300px', top: '40vh', animationDuration: '5s', width: '25vh' },
    { left: '1000px', top: '50px', animationDuration: '6s', width: '25vh' },
    { left: '900px', top: '80vh', animationDuration: '6s', width: '15vh' },
  ];

  
  const meteors = meteorStyles.map((style, index) => (
    <img
      key={index}
      className="meteor"
      src={meteor}
      alt={`meteor-${index}`}
      style={style}
    />
  ));

  return (
    <div className="App">
      <div className="navBar">
        <Profile />
      </div>
      <div className="header">
        <h1 className="falling-text">
          <span>W</span>
          <span>O</span>
          <span>R</span>
          <span>D</span>
          <span>    </span>
          <span> </span>
          <span> </span>
          <span>G</span>
          <span>A</span>
          <span>M</span>
          <span>E</span>
        </h1>
      </div>
      <div className="box">
        <h1>How to Play</h1>
        <p className='Rules'>
          Rules are simple. Words will fall, and you have to type them in the box.
          The faster you type, the more points you get. So let's start the game!! All the best!!
        </p>
        <LogoutButton />
      </div>
      <img className="w" src={image} alt="wordw" />
      {meteors}
      <Routes>
        <Route
          path='/game'
          element={
            <GameLayout>
              <GamePage />
            </GameLayout>
          }
        />
        <Route path='/' element={<LoginButton />} />
      </Routes>
    </div>
  );
}

export default App;
