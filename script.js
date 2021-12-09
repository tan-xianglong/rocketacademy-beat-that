//pseudo codes
// 1. validates input by ensuring player click submit without input to roll dice
// 2. after submitting, 2 dices are rolled
// 3. ask player to chose dice A or B and validate input
// 4. concatenate the numbers and convert back to number
// 5. once combined, add it into the array of answers
// 6. proceed to repeat 1 - 5
// 7. check which number is array is the highest and provide the index
// 8. index + 1 will  be the player number who wins

//defining global variables & setting up initial game status & arrays
const gameModeArray = ["highest", "lowest", "knockout"];
const HIGHEST = "highest";
const LOWEST = "lowest";
const KNOCKOUT = "knockout";
const pendingToRoll = "pending to roll";
const pendingGameMode = "pending game mode";
const pendingNumOfDice = "pending number of Dice";
const pendingNumOfPlayers = "pending number of players";
let playersArray = [];
let faceOffArray = [];
let numOfDice;
let totalNumOfPlayers;
let gameStatus = pendingNumOfPlayers;
let gameMode;
let playerNum = 1;

//creating object factory to generate player object
const createPlayer = (player) => {
  return {
    player: player,
    diceNumRolled: [],
    numResult: 0,
    score: 0,
  };
};

//function to initialize the playersArray for storing players info such a dice score
const initializePlayersArray = (numOfPlayers) => {
  playersArray = [];
  for (i = 0; i < numOfPlayers; i += 1) {
    playersArray.push(createPlayer(i + 1));
  }
  console.log(playersArray);
};

//creating a function to switch game mode
const switchGameMode = (input) => {
  switch (input) {
    case "highest":
      gameMode = HIGHEST;
      break;
    case "lowest":
      gameMode = LOWEST;
      break;
    case "knockout":
      gameMode = KNOCKOUT;
      break;
  }
  gameStatus = pendingToRoll;
  if (gameMode == HIGHEST || gameMode == LOWEST) {
    return `Hello Player ${playerNum}, the game mode is now '${gameMode}'. Please press Submit button to roll the dice.`;
  } else {
    return `The game mode is now ${gameMode}. Please press Submit button to draw players to face off.`;
  }
};

//creating a function that rolls a dice number
const rollDice = () => {
  let diceNum = Math.floor(Math.random() * 6) + 1;
  return diceNum;
};

//creating leadersboard message function
const leadersboardMsg = (playersArray) => {
  //copying out a new scoring array for leadersboard sorting
  let leadersboardArray = [...playersArray];
  leadersboardArray = leadersboardArray.sort((a, b) => b.score - a.score);
  console.log(leadersboardArray);
  let msg = "";
  for (const player of leadersboardArray) {
    msg += `${leadersboardArray.indexOf(player) + 1}. Player ${
      player.player
    }: ${player.score} points<br>`;
  }
  return msg;
};

//creating function to run highest scoring game mode
const highestMode = (playersArray, input) => {
  if (input != "") {
    return `Hi Player ${playerNum}. Please kindly click the Submit button to roll the dice.`;
  }
  for (i = 0; i < numOfDice; i += 1) {
    playersArray[playerNum - 1].diceNumRolled[i] = rollDice();
  }
  playersArray[playerNum - 1].diceNumRolled.sort((a, b) => b - a);
  playersArray[playerNum - 1].numResult = Number(
    playersArray[playerNum - 1].diceNumRolled.join("")
  );
  playersArray[playerNum - 1].score += playersArray[playerNum - 1].numResult;

  let msg = `Hi Player ${playerNum}, you rolled ${
    playersArray[playerNum - 1].diceNumRolled
  } for your dice.`;

  if (playerNum == totalNumOfPlayers) {
    let winningNum = Math.max(
      ...playersArray.map((player) => player.numResult)
    );
    let winningPlayer =
      playersArray.map((player) => player.numResult).indexOf(winningNum) + 1;

    msg =
      msg +
      `<br><br>The winner is Player ${winningPlayer} with a value ${winningNum}.<br><br><h3>Leadersboard</h3>${leadersboardMsg(
        playersArray
      )}`;

    playerNum = 1;
    return msg;
  }
  playerNum += 1;
  return msg;
};

//creating function to run lowest scoring game mode
const lowestMode = (playersArray, input) => {
  if (input != "") {
    return `Hi Player ${playerNum}. Please kindly click the Submit button to roll the dice.`;
  }
  for (i = 0; i < numOfDice; i += 1) {
    playersArray[playerNum - 1].diceNumRolled[i] = rollDice();
  }
  playersArray[playerNum - 1].diceNumRolled.sort((a, b) => a - b);
  playersArray[playerNum - 1].numResult = Number(
    playersArray[playerNum - 1].diceNumRolled.join("")
  );
  playersArray[playerNum - 1].score += playersArray[playerNum - 1].numResult;

  let msg = `Hi Player ${playerNum}, you rolled ${
    playersArray[playerNum - 1].diceNumRolled
  } for your dice.`;

  if (playerNum == totalNumOfPlayers) {
    let winningNum = Math.min(
      ...playersArray.map((player) => player.numResult)
    );
    let winningPlayer =
      playersArray.map((player) => player.numResult).indexOf(winningNum) + 1;

    msg =
      msg +
      `<br><br>The winner is Player ${winningPlayer} with a value ${winningNum}.<br><br><h3>Leadersboard</h3>${leadersboardMsg(
        playersArray
      )}`;

    playerNum = 1;
    return msg;
  }
  playerNum += 1;
  return msg;
};

//creating function to run knockout mode
//1. need a separate array of selected players for face off
//2. the loser in the face off will be removed from the original array
//3. repeat 1 & 2 until there is only 1 player in the original array and declare winner.
const knockoutMode = (playersArray, input) => {
  if (faceOffArray.length == 0) {
    if (input != "") {
      return `Hi user. Please kindly click the Submit button to draw the players for face off.`;
    }
    let playerA_Index = Math.floor(Math.random() * playersArray.length);
    let playerB_Index = Math.floor(Math.random() * playersArray.length);
    while (playerA_Index == playerB_Index) {
      playerB_Index = Math.floor(Math.random() * playersArray.length);
    }
    let playerA = playersArray[playerA_Index];
    let playerB = playersArray[playerB_Index];
    faceOffArray.push(playerA);
    faceOffArray.push(playerB);
    console.log(faceOffArray);
    return `Player ${faceOffArray[0].player} and Player ${faceOffArray[1].player} will face off each other for the knockout round. Player ${faceOffArray[0].player} please click Submit to roll the dice.`;
  }
  if (input != "") {
    return `Hi Player ${
      faceOffArray[playerNum - 1].player
    }. Please kindly click the Submit button to roll the dice.`;
  }
  for (i = 0; i < numOfDice; i += 1) {
    faceOffArray[playerNum - 1].diceNumRolled[i] = rollDice();
  }
  faceOffArray[playerNum - 1].diceNumRolled.sort((a, b) => b - a);
  faceOffArray[playerNum - 1].numResult = Number(
    faceOffArray[playerNum - 1].diceNumRolled.join("")
  );
  let msg = `Hi Player ${faceOffArray[playerNum - 1].player}, you rolled ${
    faceOffArray[playerNum - 1].diceNumRolled
  } for your dice.`;

  if (playerNum == faceOffArray.length) {
    let winningNum = Math.max(
      ...faceOffArray.map((player) => player.numResult)
    );
    let winningPlayerIndex = faceOffArray
      .map((player) => player.numResult)
      .indexOf(winningNum);
    let winningPlayer = faceOffArray[winningPlayerIndex].player;
    let losingPlayerIndex = winningPlayerIndex == 0 ? 1 : 0;
    console.log(losingPlayerIndex);
    let losingPlayer = faceOffArray[losingPlayerIndex].player;
    let eliminatingPlayerIndex = playersArray
      .map((player) => player.player)
      .indexOf(losingPlayer);
    console.log(eliminatingPlayerIndex);
    console.log(playersArray);
    deletedArray = playersArray.splice(eliminatingPlayerIndex, 1);
    console.log(playersArray);
    faceOffArray = [];
    console.log(faceOffArray.length);
    playerNum = 0;
    if (playersArray.length == 1) {
      msg += `<br><br>The winner is Player ${winningPlayer}! Congratulation you have won the knockout competition! Click Submit button to restart`;
      initializePlayersArray(totalNumOfPlayers);
    } else {
      msg += `<br><br>The winner is Player ${winningPlayer}! Player ${winningPlayer} will proceed to the next round. Click Submit button to draw new players.`;
    }
  }

  playerNum += 1;
  return msg;
};

var main = function (input) {
  if (gameStatus == pendingNumOfPlayers) {
    if (isNaN(input) || input == "") {
      return "Hello user, please kindly input a number for the number of players.";
    }
    totalNumOfPlayers = Number(input);
    initializePlayersArray(totalNumOfPlayers);
    gameStatus = pendingNumOfDice;
    return "Hello user, how many dice would you like to play with?";
  }

  if (gameStatus == pendingNumOfDice) {
    if (!isNaN(input) && input >= 1) {
      numOfDice = input;
      gameStatus = pendingGameMode;
      return "Hello user, please select game mode: 'Highest', 'Lowest' and 'Knockout'.";
    }
    return "Hello user, please kindly input a number for the number of dice.";
  }

  if (gameStatus == pendingGameMode) {
    input = input.trim().toLowerCase();
    if (gameModeArray.indexOf(input) == -1) {
      return "Hello user, you did not input the correct game mode. Please select game mode: 'Highest', 'Lowest' and 'Knockout'.";
    } else {
      return switchGameMode(input);
    }
  }
  console.log(faceOffArray);
  if (gameStatus == pendingToRoll) {
    switch (gameMode) {
      case HIGHEST:
        return highestMode(playersArray, input);
      case LOWEST:
        return lowestMode(playersArray, input);
      case KNOCKOUT:
        return knockoutMode(playersArray, input);
    }
  }
};
