// --- Game State Variables ---
var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var isGameActive = true;
var playAgainstComputer = false; // false = PvP, true = vs Computer

// --- DOM Elements ---
var cells = document.querySelectorAll(".cell");
var statusText = document.getElementById("status");
var restartBtn = document.getElementById("restart-btn");
var pvpBtn = document.getElementById("pvp-btn");
var pvcBtn = document.getElementById("pvc-btn");

// --- Win Combinations Matrix ---
var winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- Main Click Handler ---
function handleCellClick(event) {
    var clickedCell = event.target;
    var index = clickedCell.getAttribute("data-index");

    // If cell is already filled or game is over, do nothing
    if (board[index] !== "" || isGameActive === false) {
        return;
    }

    // Player X or Player O makes a move
    executeMove(clickedCell, index);

    // If playing against computer and it's O's turn, make computer move
    if (playAgainstComputer === true && isGameActive === true && currentPlayer === "O") {
        statusText.innerText = "Computer is thinking...";
        
        // Short delay so it looks realistic
        setTimeout(function() {
            runComputerTurn();
        }, 500);
    }
}

// --- Put Mark on Board and Check Status ---
function executeMove(cellElement, index) {
    board[index] = currentPlayer;
    cellElement.innerText = currentPlayer;
    
    // Add class for color styling (x or o)
    cellElement.classList.add(currentPlayer.toLowerCase());

    // Check if this move won the game
    checkWinner();
}

// --- Check Win or Tie Conditions ---
function checkWinner() {
    var wonRound = false;

    // Check all 8 winning combinations using a classic loop
    for (var i = 0; i < winConditions.length; i++) {
        var condition = winConditions[i];
        var a = board[condition[0]];
        var b = board[condition[1]];
        var c = board[condition[2]];

        // Skip if any cell in the combination is empty
        if (a === "" || b === "" || c === "") {
            continue;
        }

        // If all three match, we have a winner
        if (a === b && b === c) {
            wonRound = true;
            break;
        }
    }

    if (wonRound === true) {
        statusText.innerText = "Player " + currentPlayer + " Wins!";
        isGameActive = false;
        return;
    }

    // Check for a tie (if no empty strings are left)
    var isTie = true;
    for (var j = 0; j < board.length; j++) {
        if (board[j] === "") {
            isTie = false;
        }
    }

    if (isTie === true) {
        statusText.innerText = "It's a Tie!";
        isGameActive = false;
        return;
    }

    // Switch turns if nobody won yet
    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }
    statusText.innerText = "Player " + currentPlayer + "'s turn";
}

// --- Basic Computer AI ---
function runComputerTurn() {
    var emptySpaces = [];

    // Collect all empty slot indexes
    for (var i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptySpaces.push(i);
        }
    }

    // Select a random index from the empty spaces array
    var randomChoice = Math.floor(Math.random() * emptySpaces.length);
    var chosenCellIndex = emptySpaces[randomChoice];

    // Find the corresponding HTML div block to update it
    var targetCell = document.querySelector('[data-index="' + chosenCellIndex + '"]');
    
    executeMove(targetCell, chosenCellIndex);
}

// --- Reset Everything ---
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusText.innerText = "Player X's turn";

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].classList.remove("x");
        cells[i].classList.remove("o");
    }
}

// --- Change Game Mode Mode ---
function setMode(vsComputer) {
    playAgainstComputer = vsComputer;
    
    if (vsComputer === true) {
        pvcBtn.classList.add("active");
        pvpBtn.classList.remove("active");
    } else {
        pvpBtn.classList.add("active");
        pvcBtn.classList.remove("active");
    }
    resetGame();
}

// --- Attach Event Listeners ---
for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", handleCellClick);
}

restartBtn.addEventListener("click", resetGame);

pvpBtn.addEventListener("click", function() {
    setMode(false);
});

pvcBtn.addEventListener("click", function() {
    setMode(true);
});