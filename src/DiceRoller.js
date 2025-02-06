import React, { useState, useRef, useEffect } from 'react'; 
import './DiceRoller.css';

const DiceRoller = () => {
  const [userGuess, setUserGuess] = useState('');
  const [numDice, setNumDice] = useState(2);
  const [diceValues, setDiceValues] = useState(Array(numDice).fill(1));
  const [message, setMessage] = useState('');
  const [rolling, setRolling] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [muted, setMuted] = useState(false);

  const diceSoundRef = useRef(null);

  useEffect(() => {
    diceSoundRef.current = new Audio('/dice-roll.mp3');
    diceSoundRef.current.load();
  }, []);

  const getRandomDiceValue = () => Math.floor(Math.random() * 6) + 1;

  // Function to roll dice and calculate sum
  const rollDice = () => {
    const minSum = numDice * 1;
    const maxSum = numDice * 6;

    if (!userGuess || userGuess < minSum || userGuess > maxSum) {
      setMessage(`❌ Please enter a valid sum between ${minSum} and ${maxSum}!`);
      return;
    }

    setRolling(true);

    if (diceSoundRef.current) {
      diceSoundRef.current.currentTime = 0;
      diceSoundRef.current.muted = muted;
      diceSoundRef.current.play().catch((error) => console.error('Audio play failed:', error));
    }

    const rollingInterval = setInterval(() => {
      setDiceValues(Array.from({ length: numDice }, () => getRandomDiceValue()));
    }, 500);

    setTimeout(() => {
      clearInterval(rollingInterval);

      const finalDiceValues = Array.from({ length: numDice }, () => getRandomDiceValue());
      setDiceValues(finalDiceValues);

      const sum = finalDiceValues.reduce((acc, curr) => acc + curr, 0);
      const isCorrect = parseInt(userGuess) === sum;

      setMessage(
        isCorrect 
          ? '🎉 Congratulations! You guessed it right!' 
          : `❌ Oops! The correct sum was ${sum}. Try again.`
      );

      const resultSound = new Audio(isCorrect ? '/success.mp3' : '/fail.mp3');
      resultSound.muted = muted;
      resultSound.play().catch((error) => console.error('Audio play failed:', error));

      setRolling(false);
    }, 5000);
  };

  // Function to toggle mute state
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Dynamic min/max values based on selected number of dice
  const minSum = numDice * 1;
  const maxSum = numDice * 6;

  return (
    <div className="container">
      <h1 className="game-title animate-fade-in">🎲 Dice Roller Game 🎲</h1>
      <p className="animate-bounce">Guess the sum of the dice (between {minSum} and {maxSum}):</p>

      <label>Number of Dice:</label>
      <input
        type="number"
        min="1"
        max="5"
        value={numDice}
        onChange={(e) => setNumDice(parseInt(e.target.value) || 1)}
        className="input animate-fade-in"
        disabled={rolling}
      />

      <label>Your Guess:</label>
      <input
        type="number"
        min={minSum}
        max={maxSum}
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
      <button onClick={toggleMute} className="button mute-button animate-fade-in">
        {muted ? '🔇 Unmute' : '🔊 Mute'}
      </button>

      {diceValues.length > 0 && (
        <div className={`dice-container ${rolling ? 'rolling' : ''}`}>
          {diceValues.map((value, index) => (
            <img 
              key={index} 
              src={`/dice-images/dice${value}.png`} 
              alt={`Dice ${value}`} 
              className="dice" 
              onError={(e) => e.target.src = '/dice-images/default.png'}
            />
          ))}
        </div>
      )}

      <h3 className="message animate-fade-in">{message}</h3>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
};

const RulesModal = ({ onClose }) => (
  <div className="rules-modal">
    <div className="rules-content animate-scale-in">
      <h2>Game Rules 📜</h2>
      <ul>
        <li>Select the number of dice to roll.</li>
        <li>Enter a number between the minimum and maximum possible sum.</li>
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
