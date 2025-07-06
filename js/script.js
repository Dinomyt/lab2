document.addEventListener("DOMContentLoaded", () => {
  const maxAttempts = 7;
  let randomNumber, attempts;

  // UI elements
  const guessBtn       = document.getElementById("guessBtn");
  const resetBtn       = document.getElementById("resetBtn");
  const playerGuess    = document.getElementById("playerGuess");
  const resultMsg      = document.getElementById("resultMsg");
  const attemptsCell   = document.getElementById("attempts");
  const lastGuessCell  = document.getElementById("lastGuess");
  const resultTextCell = document.getElementById("resultText");

  function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    attempts     = 0;

    // Reset UI
    attemptsCell.textContent   = attempts;
    lastGuessCell.textContent  = "None";
    resultTextCell.textContent = "Make a guess!";
    resultMsg.textContent      = `Guess a number between 1 and 99 in ${maxAttempts} attempts!`;

    guessBtn.disabled  = false;
    playerGuess.disabled = false;
    playerGuess.value  = "";
    playerGuess.focus();
    resetBtn.style.display = "none";
  }

  function endGame(win) {
    guessBtn.disabled     = true;
    playerGuess.disabled  = true;
    resetBtn.style.display = "inline-block";

    if (!win) {
      resultMsg.textContent  = `Game over! The number was ${randomNumber}.`;
      resultTextCell.textContent = "😞";
    }
  }

  function makeGuess() {
    const guess = parseInt(playerGuess.value, 10);

    // Validate
    if (isNaN(guess) || guess < 1 || guess > 99) {
      resultMsg.textContent = "Please enter a valid number between 1 and 99.";
      return;
    }

    attempts++;
    attemptsCell.textContent  = attempts;
    lastGuessCell.textContent = guess;

    // Check result
    if (guess === randomNumber) {
      resultMsg.textContent      = `🎉 Congratulations! You guessed it in ${attempts} attempt${attempts>1?"s":""}.`;
      resultTextCell.textContent = "Correct!";
      endGame(true);

    } else if (attempts >= maxAttempts) {
      endGame(false);

    } else {
      if (guess < randomNumber) {
        resultTextCell.textContent = "Too low!";
        resultMsg.textContent      = "Try again!";
      } else {
        resultTextCell.textContent = "Too high!";
        resultMsg.textContent      = "Try again!";
      }
      playerGuess.value = "";
      playerGuess.focus();
    }
  }

  function resetGame() {
    initializeGame();
  }

  // Wire up buttons
  guessBtn.addEventListener("click", makeGuess);
  resetBtn.addEventListener("click", resetGame);

  // Start first game
  initializeGame();
});
