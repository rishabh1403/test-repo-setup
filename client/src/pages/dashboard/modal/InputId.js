import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './modal-content.css';

const InputId = () => {
  const [isRedirected, setRedirect] = useState(false);
  const [gameId, setGameId] = useState('');

  const handleChange = (event) => {
    const id = event.target.value;
    setGameId(id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRedirect(true);
  };

  if (isRedirected) {
    return <Redirect to={`/game?id=${gameId}`} />;
  }
  return (
    <div className="modal-content-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
        Enter ID: &nbsp;
          <input style={{ margin: '10px' }} name="id" placeholder="Game ID" type="text" onChange={handleChange} />
        </label>
        <button className="game-button" type="submit">
        Go to Game
        </button>
      </form>
    </div>
  );
};

export default InputId;
