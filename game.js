let playerContainer;
let machineContainer;

let root;

let turnDisplay;

let playerTurn = true;
let gameIsOver = false;

const columns = 10;
const rows = 10;

const ships = [
  [[0, 0]],
  [
    [0, 0],
    [0, 1],
  ],
  [
    [0, 0],
    [0, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],

  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [0, 0],
    [1, 0],
  ],
  [
    [0, 0],
    [1, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const checkWinner = (side) => {
  const elements = document.getElementsByClassName(side);
  let hasWon = true;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.classList.contains("ship")) {
      if (element.classList.contains("hidden")) {
        hasWon = false;
      }
    }
  }

  if (hasWon) {
    const display = document.getElementById("gameover-container");
    if (side === "machine-cell") {
      display.innerHTML = "You WON!!";
    } else {
      display.innerHTML = "You LOST!!";
    }
    gameIsOver = true;
  }
};

const checkCell = (button) => {
  if (!button.classList.contains("hidden")) {
    return false;
  }
  button.classList.remove("hidden");
  button.classList.remove("hide");
  if (button.classList.contains("ship")) {
    button.classList.add("hit");
    return false;
  } else {
    button.classList.add("empty");
  }
  return true;
};

const aiMove = async () => {
  await sleep(1000);
  const cells = Array.from(
    document.getElementsByClassName("player-cell")
  ).filter((cell) => cell.classList.contains("hidden"));

  const index = Math.floor(Math.random() * cells.length);
  const button = cells[index];
  if (checkCell(button)) {
    playerTurn = true;
    checkWinner("player-cell");
    turnDisplay.innerHTML = "Your turn!!";
    root.style.setProperty("--player-opacity", "0.5");
    root.style.setProperty("--machine-opacity", "1");
  } else {
    checkWinner("player-cell");
    aiMove();
  }
};

const handleClick = (event) => {
  if (gameIsOver) {
    return;
  }
  if (!playerTurn) {
    return;
  }
  const button = event.target;
  if (!button.classList.contains("machine-cell")) {
    return;
  }
  if (checkCell(button)) {
    playerTurn = false;
    checkWinner("machine-cell");
    turnDisplay.innerHTML = "Ai is thinking...";
    root.style.setProperty("--player-opacity", "1");
    root.style.setProperty("--machine-opacity", "0.5");
    aiMove();
  }
  checkWinner("machine-cell");
};

const initBoard = (container, cellName) => {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const button = document.createElement("button");
      button.classList.add("cell");
      button.classList.add("hidden");
      if (cellName === "machine-cell") {
        button.classList.add("hide");
      }
      button.classList.add(cellName);
      button.addEventListener("click", handleClick);
      container.appendChild(button);
    }
  }
};

const addShips = (side) => {
  let elements = Array.from(document.getElementsByClassName(side));
  for (let ship of ships) {
    while (true) {
      let check = 0;
      const xpos = Math.floor(Math.random() * (columns - ship.slice(-1)[0][1]));
      const ypos = Math.floor(Math.random() * (rows - ship.slice(-1)[0][0]));

      let valid = true;

      for (let [y, x] of ship) {
        let element = elements[(ypos + y) * columns + xpos + x];
        if (element.classList.contains("ship")) {
          valid = false;
        }
        if (ypos + y - 1 >= 0) {
          element = elements[(ypos + y - 1) * columns + xpos + x];
          if (element.classList.contains("ship")) {
            valid = false;
          }
        }
        if (ypos + y + 1 < rows) {
          element = elements[(ypos + y + 1) * columns + xpos + x];
          if (element.classList.contains("ship")) {
            valid = false;
          }
        }
        if (xpos + x + 1 < columns) {
          element = elements[(ypos + y) * columns + xpos + x + 1];
          if (element.classList.contains("ship")) {
            valid = false;
          }
        }
        if (xpos + x - 1 >= 0) {
          element = elements[(ypos + y) * columns + xpos + x - 1];
          if (element.classList.contains("ship")) {
            valid = false;
          }
        }
      }

      if (valid) {
        for (let [y, x] of ship) {
          const element = elements[(ypos + y) * columns + xpos + x];
          element.classList.add("ship");
        }
        break;
      }
      check += 1;
      if (check > 20000) {
        break;
      }
    }
  }
};

window.onload = () => {
  playerContainer = document.getElementById("player-board");
  machineContainer = document.getElementById("machine-board");
  turnDisplay = document.getElementById("turn-display");
  root = document.querySelector(":root");

  initBoard(playerContainer, "player-cell");
  initBoard(machineContainer, "machine-cell");

  addShips("player-cell");
  addShips("machine-cell");
};
