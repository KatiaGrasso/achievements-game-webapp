import React, { useState,useEffect } from 'react';
import API from '../API';
const Game = ({ onGameEnd }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [secretNumber, setSecretNumber] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [gameId, setGameId] = useState(null);
  const [userId, setUserId] = useState('');
  const [initialAttempts, setInitialAttempts] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await API.getUserInfo();
       
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);


  const startGame = async (selectedDifficulty) => {
    try {
      const totalAttempts = 4 * selectedDifficulty;
      setDifficulty(selectedDifficulty);
      setAttemptsLeft(totalAttempts);
      setInitialAttempts(totalAttempts);
      setFeedback('');
      setGuess('');
      setGameStatus('in_progress');

      const newGame = await API.addGame({
        difficulty: selectedDifficulty,
        attempts: 0,
        game_status: 'in_progress',
      });

      if (newGame && newGame.secret_number !== undefined) {
        setSecretNumber(newGame.secret_number);
        setGameId(newGame.id);
      } else {
        throw new Error('Numero segreto non trovato nella risposta del server');
      }
    } catch (error) {
      console.error('Errore durante la creazione del gioco:', error);
      setFeedback('Errore nella creazione del gioco. Riprova.');
    }
  };

  const handleGuess = async () => {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > Math.pow(10, difficulty)) {
      setFeedback(`Inserisci un numero tra 1 e ${Math.pow(10, difficulty)}.`);
      return;
    }

    const remaining = attemptsLeft - 1;

    if (numGuess === secretNumber) {
      setGameStatus('won');
      setFeedback('Congratulazioni! Hai indovinato il numero.');
      await updateGameStatus('won');
      onGameEnd('won');
    } else if (remaining === 0) {
      setGameStatus('lost');
      setFeedback(`Hai perso! Il numero segreto era ${secretNumber}.`);
      await updateGameStatus('lost');
      onGameEnd('lost');
    } else {
      setAttemptsLeft(remaining);
      setFeedback(
        numGuess < secretNumber ? 'Troppo basso!' : 'Troppo alto!'
      );
    }
  };

  const updateGameStatus = async (status) => {
    try {
      const attemptsUsed = initialAttempts - attemptsLeft;
      const updatedGame = { user_id: userId, attempts: attemptsUsed, game_status: status };
      await API.updateGame(gameId, updatedGame);
      
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato del gioco:', error);
      setFeedback('Errore nell\'aggiornamento dello stato del gioco. Riprova.');
    }
  };

  if (difficulty === null) {
    return (
      <div>
        <p>Scegli il livello di difficoltà:</p>
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            className="button mx-2"
            onClick={() => startGame(level)}
          >
            Livello {level}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      {gameStatus === 'in_progress' ? (
        <div>
          <p>Indovina il numero tra 1 e {Math.pow(10, difficulty)}</p>
          <p>Hai {attemptsLeft} tentativi rimanenti.</p>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="form-control my-2"
          />
          <button onClick={handleGuess} className="button mx-2">
            Indovina
          </button>
          {feedback && <p className="mt-3">{feedback}</p>}
        </div>
      ) : (
        <div>
          <h3>{gameStatus === 'won' ? 'Hai vinto!' : 'Hai perso!'}</h3>
        
          <button  className="button mx-2"
            onClick={() => startGame(difficulty)} 
    
          >
            Gioca di nuovo
          </button>
        
          <button
            onClick={() => setDifficulty(null)} 
            className="button mx-2"
          >
            Cambia livello
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
