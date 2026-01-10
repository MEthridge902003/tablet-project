// A. SELECTING THE ELEMENTS
const playBtn = document.getElementById('play-game-btn');
const userInput = document.getElementById('user-input'); // Note: Matched to your HTML id
const resultDisplay = document.getElementById('match-result');
const computerDisplay = document.getElementById('computer-display');
const choiceButtons = document.querySelectorAll('.choice-btn');

// NEW: SCORE TRACKERS (Global Scope - these stay alive between clicks)
let playerWins = 0;
let computerWins = 0;

// ONE listener to rule them all
userInput.addEventListener('input', () => {
    
    // Logic Path A: The Game hasn't started yet (or just reset)
    if (playerWins === 0 && computerWins === 0) {
        computerDisplay.textContent = "New Match? I'm ready.";
        resultDisplay.textContent = "Enter your move to begin.";
    } 
    // Logic Path B: We are mid-series
    else {
        computerDisplay.textContent = `Next round?`;
        resultDisplay.textContent = `Score: ${playerWins} - ${computerWins}.`;
    }
});

// 2. Loop through them and add a listener to each
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Set the input box value to the button's value
        userInput.value = button.value; 
        
        // Trigger the "Start Match" button click automatically!
        playBtn.click(); 
    });
});
// Listen for 'Enter' key inside the text box
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        playBtn.click();
    }
});

// B. THE EVENT LISTENER (The "Thread" starts here)
playBtn.addEventListener('click', () => {
    const playerChoice = userInput.value.toLowerCase().trim();

    if (playerChoice === "spoon") {
        triggerMatrixMode();
        return; 
    }

    const roll = Math.floor(Math.random() * 3) + 1;
    let computerChoice = "";

    if (roll === 1) computerChoice = "rock";
    else if (roll === 2) computerChoice = "paper";
    else computerChoice = "scissors";

    computerDisplay.textContent = computerChoice;

    // 4. Determine the Winner (Now passing logic to update scores)
    determineWinner(playerChoice, computerChoice);
    
    // NEW: Selective Celebration Logic
if (playerWins === 2 || computerWins === 2) {
    
    // 1. ONLY show the alert if the human won
    if (playerWins === 2) {
        alert("MATCH OVER: YOU DEFEATED THE SYSTEM!");
    } 
    // If the computer won, we stay silent. No "Pop-up of Loserness."

    // 2. Update the display so the user can see the final 0-2 or 1-2 score
    resultDisplay.textContent = `Final Score: ${playerWins} - ${computerWins}. Match Resetting...`;

    // 3. Reset the memory
    playerWins = 0;
    computerWins = 0;
    }
    userInput.value = "";   // Clear the input box
    userInput.focus();      // Put the cursor back in the box automatically
});


// C. THE HELPER FUNCTIONS
function determineWinner(player, computer) {
    if (player === computer) {
        resultDisplay.textContent = "It's a Draw!";
    } else if (
        (player === "rock" && computer === "scissors") ||
        (player === "paper" && computer === "rock") ||
        (player === "scissors" && computer === "paper")
    ) {
        resultDisplay.textContent = "You Win!";
        playerWins++; // Increment the score
    } else {
        resultDisplay.textContent = "System Wins. Try again.";
        computerWins++; // Increment the score
    }
}
// I kept the prompt box so that I could keep my easter egg.
function triggerMatrixMode() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "#00FF00"; 
    resultDisplay.textContent = "There is no spoon...";
}