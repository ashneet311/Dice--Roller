import React, { useState, useRef, useEffect } from 'react';
import './DiceRoller.css';

const DiceRoller = () => {
  const [userGuess, setUserGuess] = useState('');
  const [diceValues, setDiceValues] = useState({ dice1: null, dice2: null });
  const [message, setMessage] = useState('');
  const [rolling, setRolling] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const diceSoundRef = useRef(null);

  useEffect(() => {
    diceSoundRef.current = new Audio(`${process.env.PUBLIC_URL}/dice-roll.mp3`);
  }, []);

  const getRandomDiceValue = () => Math.floor(Math.random() * 6) + 1;

  const rollDice = () => {
    if (!userGuess || userGuess < 2 || userGuess > 12) {
      setMessage('❌ Please enter a valid number between 2 and 12!');
      return;
    }

    setRolling(true);
    diceSoundRef.current.play().catch((error) => console.error('Audio play failed:', error));

    const rollingInterval = setInterval(() => {
      setDiceValues({ dice1: getRandomDiceValue(), dice2: getRandomDiceValue() });
    }, 500);

    setTimeout(() => {
      clearInterval(rollingInterval);

      const finalDice1 = getRandomDiceValue();
      const finalDice2 = getRandomDiceValue();
      setDiceValues({ dice1: finalDice1, dice2: finalDice2 });

      const sum = finalDice1 + finalDice2;
      setMessage(parseInt(userGuess) === sum ? '🎉 Congratulations! You guessed it right!' : `❌ Oops! The correct sum was ${sum}. Try again.`);

      setRolling(false);
    }, 5000);
  };

  return (
    <div className="container">
      <h1 className="game-title animate-fade-in">🎲 Dice Roller Game 🎲</h1>
      <p className="animate-bounce">Guess the sum of two dice (between 2 and 12):</p>

      <input
        type="number"
        min="2"
        max="12"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        className="input animate-fade-in"
        disabled={rolling}
      />
      <button onClick={rollDice} className="button animate-pulse" disabled={rolling}>
        {rolling ? 'Rolling...' : 'Roll'}
      </button>
      <button onClick={() => setShowRules(true)} className="button rules-button animate-fade-in">
        View Rules
      </button>

      {diceValues.dice1 && diceValues.dice2 && (
        <div className={`dice-container ${rolling ? 'rolling' : ''}`}>
          <img src={`/dice-images/dice${diceValues.dice1}.png`} alt={`Dice ${diceValues.dice1}`} className="dice" />
          <img src={`/dice-images/dice${diceValues.dice2}.png`} alt={`Dice ${diceValues.dice2}`} className="dice" />
        </div>
      )}

      <h3 className="message animate-fade-in">{message}</h3>

      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} />
      )}
    </div>
  );
};

const RulesModal = ({ onClose }) => (
  <div className="rules-modal">
    <div className="rules-content animate-scale-in">
      <h2>Game Rules 📜</h2>
      <ul>
        <li>Enter a number between 2 and 12.</li>
        <li>Click "Roll" to roll the dice.</li>
        <li>If your guess matches the sum, you win!</li>
        <li>Try again if you don't win.</li>
      </ul>
      <button onClick={onClose} className="button close-button">
        Close
      </button>
    </div>
  </div>
);

export default DiceRoller;
