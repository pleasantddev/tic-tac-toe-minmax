const board = Array(9).fill("");
let currentPlayer = "X";
const boardDiv = document.getElementById("board");
const statusDiv = document.getElementById("status");

function render() {
  boardDiv.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.onclick = () => makeMove(i);
    boardDiv.appendChild(div);
  });
}

function makeMove(index) {
  if (board[index] !== "" || isGameOver()) return;
  board[index] = currentPlayer;
  render();
  const winner = checkWinner();
  if (winner) {
    statusDiv.textContent = `Game Over: ${winner} wins!`;
    return;
  } else if (board.every((cell) => cell !== "")) {
    statusDiv.textContent = "Game Over: It's a draw!";
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDiv.textContent = `Next move: ${currentPlayer}`;
  if (currentPlayer === "O") {
    const bestMove = findBestMove();
    board[bestMove] = "O";
    currentPlayer = "X";
    render();
    const winner = checkWinner();
    if (winner) {
      statusDiv.textContent = `Game Over: ${winner} wins!`;
    } else if (board.every((cell) => cell !== "")) {
      statusDiv.textContent = "Game Over: It's a draw!";
    } else {
      statusDiv.textContent = `Next move: ${currentPlayer}`;
    }
  }
}

function isGameOver() {
  return !!checkWinner() || board.every((cell) => cell !== "");
}

function checkWinner() {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  let winner = checkWinner();
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (newBoard.every((cell) => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function restart() {
  window.location.reload();
}

render();
