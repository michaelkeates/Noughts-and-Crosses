const statusDisplay = document.querySelector(".game--status");
//new query selectors
const typeDisplay = document.querySelector(".game--type");
const opponentDisplay = document.querySelector(".game--opponent");
const roundsDisplay = document.querySelector(".game--rounds");
const gridDisplay = document.querySelector(".game--type");

let gameActive = true;
let currentPlayer;
//old tutorial code as moved to new functions
//let gameState = ["", "", "", "", "", "", "", "", ""];
let gameState;

//new variables
let gameType = 3;
let cellCount = 9;
let xWins = 0;
let oWins = 0;
//determine if player is playing against ai or not
let opponentType = "Human";

let isNormalMode = true;
let isBestofMode = false;
let bestOf;
let minWinningVariations;
let maxWinningVariations;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn in Normal Mode`;
//added new messages
const removeMessage = () => "";
const currentPlayerTurnPartyMode = () =>
  `It's ${currentPlayer}'s turn in Party Mode`;
const currentGrid = () => `${gameType} by ${gameType} grid`;
const currentOpponent = () => `${opponentType}`;
const currentRounds = () => `${bestOf} rounds`;
const infiniteRounds = () => `Infinity`;
//embed html to be used
const hiddenMessage = () =>
  `<div class="card-message"><div class="card-info"><h2>Oh dear! I have for this round hidden the winning cells to make it harder. Yours Truly.</h2></div></div>`;

const embeddedVideo = () =>
  `<iframe width="560" height="315" src="https://www.youtube.com/embed/jM9fcZ99DVc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

//added array for scores accumulated for each player
var scores = new Array();
scores["X"] = 0;
scores["O"] = 0;

//introductory message
statusDisplay.innerHTML = "Welcome to Tic Tac Toe!"

//new added class function for the AI
class AI {
  //define a function for the ai to make a move
  makeMove() {
    //check if there are any empty cells left
    const emptyCells = gameState.filter((cell) => cell === "");
    console.log(emptyCells);
    //if there are no empty cells, the game is a draw, so return
    if (emptyCells.length === 0) {
      return;
    }
    //choose a random empty cell to make a move in
    let randomIndex;
    let randomCell;
    //loop through the empty cells array
    while (true) {
      //returns a random number between 0 and the length of the emptyCells array - 1
      randomIndex = Math.floor(Math.random() * cellCount);
      //check if the cell is empty
      if (gameState[randomIndex] === "" || gameState[randomIndex] === null) {
        //select the cell
        randomCell = document.querySelector(
          `.cell[data-cell-index="${randomIndex}"]`
        );
        break;
      }
    }

    handleCellPlayed(randomCell, randomIndex);
    //check if game has ended
    handleResultValidation();
  }
}

//create an instance of the AI class
const ai = new AI();

const winningConditions = [
  //original tutorial code for winning conditions for normal 3x3 grid
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
  //added winning conditions for 4x4 grid
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
  //added winning conditions for 5x5 grid
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

//ORIGINAL TUTORIAL CODE
function handleCellPlayed(clickedCell, clickedCellIndex) {
  //update the game state and display the current player's move
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;

  //access new function to allow x player to change cell if its their turn and its not normal mode
  if (currentPlayer === "X" && !isNormalMode) {
    handleCellChange();
  }

  //depending on who the player is, add the appropriate css class to the cell after clicking
  if (currentPlayer === "X") {
    //add x-player css class to clicked cell to change colour
    clickedCell.classList.add("x-player");
    gameState[clickedCellIndex] = "X";
  } else {
    //add o-player css class to clicked cell to change colour
    clickedCell.classList.add("o-player");
    gameState[clickedCellIndex] = "O";
    if (clickedCell.classList.contains("winningcells")) {
      clickedCell.classList.remove("winningcells");
      clickedCell.classList.add("o-player");
    }
  }

  // COMMENTED OUT AS WANT FONT INSTEAD OF IMAGE
  //hope this isnt a 'disenhancement' of sorts :)
  //
  //if (currentPlayer == "X") {
  //  clickedCell.innerHTML =
  //    "<img src = 'x.png' alt = '0' width = '100' height = '100'>";
  //} else {
  //  clickedCell.innerHTML =
  //    "<img src = 'o.png' alt = '0' width = '100' height = '100'>";
  //}
}

//ORIGINAL TUTORIAL CODE
function handlePlayerChange() {
  //if the current player is X, change it to O and change player and update game status to reflect whos turn it is
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  //disabled this as working without?
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
  //first do check to make sure game is still going and no one has won
  let roundWon = false;

  //check for winning conditions in 3x3 grid
  if (gameType === 3 && gameActive) {
    //for (let i = 7; i <= 7; i++) {
    for (let i = minWinningVariations; i <= maxWinningVariations; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }
  }

  //check for winning conditions in 4x4 grid
  if (gameType === 4 && gameActive) {
    //for (let i = 8; i <= winningVariations; i++) {
    for (let i = minWinningVariations; i <= maxWinningVariations; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      let d = gameState[winCondition[3]];
      if (a === "" || b === "" || c === "" || d === "") {
        continue;
      }
      if (a === b && b === c && c === d) {
        roundWon = true;
        break;
      }
    }
  }

  //check for winning conditions in 5x5 grid
  if (gameType === 5 && gameActive) {
    //for (let i = 18; i <= winningVariations; i++) {
    for (let i = minWinningVariations; i <= maxWinningVariations; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      let d = gameState[winCondition[3]];
      let e = gameState[winCondition[4]];
      //console.log(minWinningVariations);
      //console.log(maxWinningVariations);
      if (a === "" || b === "" || c === "" || d === "" || e === "") {
        continue;
      }
      if (a === b && b === c && c === d && d === e) {
        roundWon = true;
        break;
      }
    }
  }

  //if game is over, set gameActive to false and disable all cells
  if (roundWon) {
    handleScoring();
    gameActive = false;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.classList.add("disabled"));

    statusDisplay.innerHTML = winningMessage();
  }

  //instead of checking for includes we can filter through cells that have nothing in them
  //check for draw
  if (!roundWon) {
    //filter through the game state and return an array of empty cells
    const emptyCells = gameState.filter((cell) => cell === "");
    //if there are no empty cells, then the game is a draw
    if (emptyCells.length === 0) {
      roundWon = true;
      statusDisplay.innerHTML = drawMessage();
    }
  }

  //check if anyone has reached the value of bestof
  if (scores["X"] == bestOf) {
    statusDisplay.innerHTML = "X has won the game!";
    gameActive = false;
  }
  if (scores["O"] == bestOf) {
    statusDisplay.innerHTML = "O has won the game!";
    gameActive = false;
  }

  //if game is over, set gameActive to false
  gameActive = !roundWon;

  //if game is not over, change player
  if (!roundWon) {
    handlePlayerChange();
  }
}

function handleCellClick(clickedCellEvent) {
  //ignore clicks if game is not active
  if (!gameActive) {
    return;
  }

  //get the cell that was clicked on
  const clickedCell = clickedCellEvent.target;
  //get the index of the cell that was clicked on
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  //ignore clicks on cells that are not part of the current game
  if (clickedCellIndex >= cellCount) {
    return;
  }

  //ignore clicks on cells that have already been played
  if (gameState[clickedCellIndex] !== "") {
    return;
  }

  //apply css class after clicking cell to change colour etc
  if (gameActive) {
    //if cell already has winningcells class, remove it and replace with current player class
    if (clickedCell.classList.contains("winningcells")) {
      clickedCell.classList.remove("winningcells");
      clickedCell.classList.add("x-player");
    } else if (clickedCell.classList.contains("winningcells")) {
      clickedCell.classList.remove("winningcells");
      clickedCell.classList.add("o-player");
    }
  }

  //call function to handle cell played and result validation
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();

  //if current player is O call ai.makemove() to make move
  if (currentPlayer === "O" && opponentType === "AI" && gameActive) {
    ai.makeMove();
  }
}

function handleRestartGame() {
  //reset game state
  gameActive = true;
  //currentPlayer = "X";
  //randomiser to decide who goes first instead of always X as in tutorial
  let random = Math.floor(Math.random() * 2);
  if (random === 0) {
    currentPlayer = "X";
  } else {
    currentPlayer = "O";
  }

  messageContainer = document.querySelector(".message");
  messageContainer.innerHTML = removeMessage();
  opponentDisplay.innerHTML = currentOpponent();
  gridDisplay.innerHTML = currentGrid();

  //reset back to 0 if any of the scores reached value of bestOf and update what is displayed on page
  if (scores["X"] == bestOf || scores["O"] == bestOf) {
    scores["X"] = 0;
    scores["O"] = 0;
    document.getElementById("score-X").innerHTML = scores["X"];
    document.getElementById("score-O").innerHTML = scores["O"];
  }

  //notify user rounds are infinite if bestof has not been set
  if (bestOf == null) {
    roundsDisplay.innerHTML = infiniteRounds();
  }

  //if user forgets to set grid default for 3x3 grid. error correction
  if (
    minWinningVariations === undefined &&
    maxWinningVariations === undefined
  ) {
    minWinningVariations = 0;
    maxWinningVariations = 7;
  }

  //reset game state depending on grid size
  if (gameType === 3) {
    gameState = ["", "", "", "", "", "", "", "", ""];
  } else if (gameType === 4) {
    gameState = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
  } else if (gameType === 5) {
    gameState = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
  }

  //display message depending on game mode
  if (isNormalMode == false) {
    statusDisplay.innerHTML = currentPlayerTurnPartyMode();
  } else {
    statusDisplay.innerHTML = currentPlayerTurn();
  }

  //empty all cells
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));

  //implemented way to generate grid board using javascript using for loop
  //new functions added to originaly tutorial code
  //added new function to generate grid board on the fly instead of fixed 3x3 via html
  const container = document.querySelector(".game--container");

  //set grid colums depending on game type using javascript instead of hardcoded in css
  if (gameType === 3) {
    container.style.gridTemplateColumns = "repeat(3, auto)";
  } else if (gameType === 4) {
    container.style.gridTemplateColumns = "repeat(4, auto)";
  } else if (gameType === 5) {
    container.style.gridTemplateColumns = "repeat(5, auto)";
  }

  //make sure the container is empty before adding new cells
  container.innerHTML = "";

  //create the cells and add attributes like in original html code
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-cell-index", i);
    cell.addEventListener("click", handleCellClick);
    container.appendChild(cell);
  }

  //random variations for the winning condition loops if its not normal mode
  //otherwise values have been set when user selects grid size
  if (!isNormalMode) {
    if (gameType === 3) {
      //random number between 0 and 7 for 3x3 grid
      minWinningVariations = Math.floor(Math.random() * 7);
      maxWinningVariations = Math.floor(Math.random() * 7);

      //ensure that minWinningVariations is less than or equal to maxWinningVariations
      if (minWinningVariations > maxWinningVariations) {
        let temp = minWinningVariations;
        minWinningVariations = maxWinningVariations;
        maxWinningVariations = temp;
      }
    }
    if (gameType === 4) {
      //random number between 8 and 17 for 4x4 grid
      minWinningVariations = Math.floor(Math.random() * (17 - 8 + 1) + 8);
      maxWinningVariations = Math.floor(Math.random() * 17);

      //ensure that minWinningVariations is less than or equal to maxWinningVariations
      if (minWinningVariations > maxWinningVariations) {
        let temp = minWinningVariations;
        minWinningVariations = maxWinningVariations;
        maxWinningVariations = temp;
      }
    }
    if (gameType === 5) {
      //random number between 18 and 29 for 5x5 grid
      minWinningVariations = Math.floor(Math.random() * (29 - 18 + 1) + 18);
      maxWinningVariations = Math.floor(Math.random() * 29);

      //ensure that minWinningVariations is less than or equal to maxWinningVariations
      if (minWinningVariations > maxWinningVariations) {
        let temp = minWinningVariations;
        minWinningVariations = maxWinningVariations;
        maxWinningVariations = temp;
      }
    }
  }

  //show message that the winning cells are hidden if random is 0 or 2 and is not normal mode
  if ((isNormalMode === false && random === 0) || random === 2) {
    messageContainer.innerHTML = hiddenMessage();
  }
  //if random is 1 and is not normal mode, add the winningcell class to the cells to show user where they can win
  if (isNormalMode === false && random === 1) {
    for (let i = minWinningVariations; i < maxWinningVariations; i++) {
      //loop through all the cells in the winning condition
      for (let j = 0; j < winningConditions[i].length; j++) {
        //add the winningcell class to the cell
        document
          .querySelectorAll(".cell")
          [winningConditions[i][j]].classList.add("winningcells");
      }
    }
  }
  //if current player is O call ai.makemove() to make the first move
  if (currentPlayer === "O" && opponentType === "AI") {
    ai.makeMove();
    statusDisplay.innerHTML = currentPlayerTurn();
  }
}

//NEW FUNCTIONS BELOW!!!

//added new function for scoring
function handleScoring() {
  //if current player is X when function was called, add 1 to X score and update score to user
  if (currentPlayer === "X") {
    scores["X"]++;
    document.getElementById("score-X").innerHTML = scores["X"];
    //else current player is o so add 1 to the score and update score to user
  } else {
    scores["O"]++;
    document.getElementById("score-O").innerHTML = scores["O"];
  }
}

//new function to set values for a game of 3x3 with default values
function setGrid3() {
  gameType = 3;
  cellCount = 9;
  minWinningVariations = 0;
  maxWinningVariations = 7;
  typeDisplay.innerHTML = currentGrid();
}

//new function to set values for a game of 4x4 with default values
function setGrid4() {
  gameType = 4;
  cellCount = 16;
  minWinningVariations = 8;
  maxWinningVariations = 17;
  typeDisplay.innerHTML = currentGrid();
}

//new function to set values for a game of 5x5 with default values
function setGrid5() {
  gameType = 5;
  cellCount = 25;
  minWinningVariations = 18;
  maxWinningVariations = 29;
  typeDisplay.innerHTML = currentGrid();
}

//new function to play against human and to update html
function setHumanOpponent() {
  opponentType = "Human";
  opponentDisplay.innerHTML = currentOpponent();
}

//new function to play against AI and to update html
function setAIOpponent() {
  opponentType = "AI";
  opponentDisplay.innerHTML = currentOpponent();
}

//new function to set the game to normal mode set boolean to true
function setNormal() {
  isNormalMode = true;
}

//new function to set the game to party mode set boolean to false
function setParty() {
  isNormalMode = false;
}

//new function to allow the user to set the number of rounds they want to play with 3 being default value
function setRounds() {
  isBestofMode = true;

  bestOf = prompt("Please enter how many rounds you would like to play", "3");
  if (bestOf != null) {
    console.log(bestOf);
    roundsDisplay.innerHTML = currentRounds();
  }
}

//new function to allow the user to 'steal' a cell from the other player randomly
function handleCellChange(clickedCell, clickedCellIndex) {
  let random = Math.floor(Math.random() * 10);

  if (random === 1) {
    //check if the cell has already been played
    if (gameState[clickedCellIndex] !== "") {
      //if the cell has already been played, display a message to the player
      //get all the empty cells on the board
      const emptyCells = gameState.filter((cell) => cell === "");
      //if there are no empty cells, the game is a draw, so return
      if (emptyCells.length === 0) {
        return;
      }
      //allow the player to choose a new empty cell
      let newCellIndex;
      let newCell;

      //give player prompt to pick cell that has been clicked by player o
      if (currentPlayer === "X") {
        newCellIndex = prompt(
          "Please enter the cell number you would like to play",
          "0"
        );
        //if the cell has been clicked by o or ha the winningcells css applied remove before adding css for x player
        newCell = document.querySelectorAll(".cell")[newCellIndex];
        //remove whatever there is previously
        newCell.classList.remove("o-player");
        newCell.classList.remove("x-player");
        newCell.classList.remove("winningcells");
        //add
        newCell.classList.add("x-player");
        gameState[clickedCellIndex] = "X";
      } else {
        //if AI is opponent, pick random cell
        newCellIndex = Math.floor(Math.random() * emptyCells.length);
        newCell = document.querySelectorAll(".cell")[newCellIndex];
      }

      //update the game state and the display with the new cell selection
      //gameState[newCellIndex] = currentPlayer;
      //newCell.innerHTML = currentPlayer;
      gameState[newCellIndex] = "X";
      newCell.innerHTML = "X";
      handlePlayerChange();
      handleResultValidation();
    }
  }
}

//new function to handle the video button
function handleVideo() {
  videoContainer = document.querySelector(".game--container");
  //do inner html to replace game--container with html code
  videoContainer.innerHTML = embeddedVideo();
}

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);

//new event listeners for video button
document
  .querySelector(".video--tutorial")
  .addEventListener("click", handleVideo);
