import React from 'react';
import { generate } from 'shortid';
import './modal-content.css';

const ShowId = () => {
  const gameId = generate();
  return (
    <div className="modal-content-container">
      Share this ID with your friend: &nbsp;
      <p>{gameId}</p>
      <a href={`/game/${gameId}`}>
        <button className="game-button" type="button">
          Go to Game
        </button>
      </a>
    </div>
  );
};

export default ShowId;
