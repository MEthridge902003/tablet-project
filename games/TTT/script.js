{// 1. SETUP: Variables and Win Conditions
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

let board = ["", "", "", "", "", "", "", "", ""];
const aiMarker = "O";
const humanMarker = "X";
// This tells JS to find the squares you made in HTML
const cells = document.querySelectorAll('#TTT-modal .cell'); 
const resetBtn = document.getElementById('reset-btn');

// 2. THE BRAIN: Your original logic
function getBestMove(board, aiMarker, humanMarker) {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") { 
            let score = 0;

            if (i === 4) score += 10; // Center
            if ([0, 2, 6, 8].includes(i)) score += 5; // Corners

            winCombos.forEach(combo => {
                if (combo.includes(i)) {
                    const otherTwo = combo.filter(idx => idx !== i);
                    const contents = [board[otherTwo[0]], board[otherTwo[1]]];

                    if (contents.every(cell => cell === aiMarker)) {
                        score += 1000; // Win move
                    } else if (contents.every(cell => cell === humanMarker)) {
                        score += 500; // Block move
                    }
                }
            });

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// 3. THE NERVOUS SYSTEM: Handling Clicks
cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');

        // Check if square is empty AND no one has won yet
        if (board[index] === "" && !checkWin(board, aiMarker) && !checkWin(board, humanMarker)) {
            
            // 1. Human Move
            makeMove(index, humanMarker);

            // 2. Check if Human won
            if (checkWin(board, humanMarker)) {
                setTimeout(() => alert("You win!"), 100);
                return; 
            }

            // 3. AI Move
            setTimeout(() => {
                const aiMove = getBestMove(board, aiMarker, humanMarker);
                if (aiMove !== null) {
                    makeMove(aiMove, aiMarker);
                    
                    // 4. Check if AI won
                    if (checkWin(board, aiMarker)) {
                        setTimeout(() => alert("The AI wins!"), 100);
                    }
// ADD THIS: Check for a draw if no one won
else if (!board.includes("")) {
    setTimeout(() => alert("It's a draw! Nice game."), 100);
}
                }
            }, 300);
        }
    });
});

// 4. HELPERS: Win Checkers & UI Updaters
function makeMove(index, marker) {
    board[index] = marker;
    document.querySelector(`[data-index="${index}"]`).innerText = marker;
}

function checkWin(currentBoard, marker) {
    return winCombos.some(combo => {
        return combo.every(index => currentBoard[index] === marker);
    });
}

// 5. THE RESET: Wiping the slate clean
resetBtn.addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.innerText = "";
    });
    console.log("Game Reset!");
});
}