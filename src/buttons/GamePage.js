import React from 'react';

const GamePage = () => {
  const openGameInNewWindow = () => {
    window.open('http://localhost:3000/vanilla/index.html', '_blank');
  };

  return (
    <div className="game-page">
      <button className='newWindow' onClick={openGameInNewWindow}>Start Game</button>
    </div>
  );
};

export default GamePage;