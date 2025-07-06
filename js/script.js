// js/script.js

document.addEventListener("DOMContentLoaded", () => {
  const maxAttempts = 7;
  let randomNumber;
  let attempts;
  // keep wins/losses in memory only:
  let wins = 0;
  let losses = 0;

  // UI elements
  const guessBtn = document.getElementById("guessBtn");
  const resetBtn = document.getElementById("resetBtn");
  const playerGuess = document.getElementById("playerGuess");
  const resultMsg = document.getElementById("resultMsg");
  const attemptsCell = document.getElementById("attempts");
  const lastGuessCell = document.getElementById("lastGuess");
  const resultTextCell = document.getElementById("resultText");
  const winsCell = document.getElementById("wins");
  const lossesCell = document.getElementById("losses");

  function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    attempts = 0;

    // Reset UI fields
    attemptsCell.textContent = attempts;
    lastGuessCell.textContent = "None";
    resultTextCell.textContent = "Make a guess!";
    resultMsg.textContent = `Guess a number between 1 and 99 in ${maxAttempts} attempts!`;

    // Reflect current session record
    winsCell.textContent = wins;
    lossesCell.textContent = losses;

    guessBtn.disabled = false;
    playerGuess.disabled = false;
    playerGuess.value = "";
    playerGuess.focus();
    resetBtn.style.display = "none";
  }

  function endGame(win) {
    guessBtn.disabled = true;
    playerGuess.disabled = true;
    resetBtn.style.display = "inline-block";

    if (win) {
      wins++;
    } else {
      losses++;
    }
    // update after increment
    winsCell.textContent = wins;
    lossesCell.textContent = losses;

    if (!win) {
      resultMsg.textContent = `Game over! The number was ${randomNumber}.`;
      resultTextCell.textContent = "😞";
    }
  }

  function makeGuess() {
    const guess = parseInt(playerGuess.value, 10);

    if (isNaN(guess) || guess < 1 || guess > 99) {
      resultMsg.textContent = "Please enter a valid number between 1 and 99.";
      return;
    }

    attempts++;
    attemptsCell.textContent = attempts;
    lastGuessCell.textContent = guess;

    if (guess === randomNumber) {
      resultMsg.textContent = `🎉 You got it in ${attempts} attempt${
        attempts > 1 ? "s" : ""
      }!`;
      resultTextCell.textContent = "Correct!";
      endGame(true);
    } else if (attempts >= maxAttempts) {
      endGame(false);
    } else {
      if (guess < randomNumber) {
        resultTextCell.textContent = "Too low!";
        resultMsg.innerHTML = "Try again!<br><br>Too low!";
      } else {
        resultTextCell.textContent = "Too high!";
        resultMsg.innerHTML = "Try again!<br><br>Too high!";
      }
      playerGuess.value = "";
      playerGuess.focus();
    }
  }

  function resetGame() {
    initializeGame();
  }

  // Hook up events
  guessBtn.addEventListener("click", makeGuess);
  resetBtn.addEventListener("click", resetGame);
  // listen for Enter key on the text input
  playerGuess.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent any form submits or default behavior
      makeGuess(); // trigger exactly the same logic as click
    }
  });

  // Kick off the first game
  initializeGame();
});
