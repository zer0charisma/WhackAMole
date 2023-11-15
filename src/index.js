const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('#start');
const score = document.getElementById('score'); 
const timerDisplay = document.getElementById('timer'); 
let startTime =10;
let time;
let timer;
let lastHole = 0;
let points = 0;
let difficulty = "normal";
let duration = 10;

/**
 * Generates a random integer within a range.
 * The function takes two values as parameters that limits the range 
 * of the number to be generated. For example, calling randomInteger(0,10)
 * will return a random integer between 0 and 10. Calling randomInteger(10,200)
 * will return a random integer between 10 and 200.
 *
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function setDelay(difficulty, event) {
  // sets delay for the moles to show up
  if (difficulty === "easy") return 1500;
  if (difficulty === "normal") return 1000;
  return randomInteger(600, 1200);
}


/**
 * Chooses a random hole from a list of holes.
 *
 * This function should select a random Hole from the list of holes.
 * 1. generate a random integer from 0 to 8 and assign it to an index variable
 * 2. get a random hole with the random index (e.g. const hole = holes[index])
 * 3. if hole === lastHole then call chooseHole(holes) again.
 * 4. if hole is not the same as the lastHole then keep track of 
 * it (lastHole = hole) and return the hole
 */

function chooseHole(holes) {
  // var named index is set to randomInteger between 0 and 8
  const index = randomInteger(0, 8);
  // var named hole as an item in the holes array
  const hole = holes[index];
  // for loop: if hole equals the last hole, loop through the holes array again
  if (hole === lastHole) {
    return chooseHole(holes);
  }
  // if lastHole is returned, set its index in order to track the lastHole
  lastHole = hole;
  return hole;
}

/**
*
* Calls the showUp function if time > 0 and stops the game if time = 0.
* The purpose of this function is simply to determine if the game should
* continue or stop. The game continues if there is still time `if(time > 0)`.
* If there is still time then `showUp()` needs to be called again so that
* it sets a different delay and a different hole. If there is no more time
* then it should call the `stopGame()` function. The function also needs to
* return the timeoutId if the game continues or the string "game stopped"
* if the game is over.
*
*/
function gameOver() {
  if (time > 0) {
    const timeoutId = showUp(); 
    return timeoutId; 
  } else {
    const gameStopped = stopGame(); 
    return gameStopped;
  }
}

/**
*
* Calls the showAndHide() function with a specific delay and a hole.
* This function simply calls the `showAndHide` function with a specific
* delay and hole. The function needs to call `setDelay()` and `chooseHole()`
* to call `showAndHide(hole, delay)`.
*/
function showUp() {
  let delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  return showAndHide(hole, delay);
}

/**
*
* The purpose of this function is to show and hide the mole given
* a delay time and the hole where the mole is hidden. The function calls
* `toggleVisibility` to show or hide the mole. The function should return
* the timeoutID
*
*/
function showAndHide(hole, delay){
  // call the toggleVisibility function so that it adds the 'show' class.
  toggleVisibility(hole);
  const timeoutID = setTimeout(() => {
    // call the toggleVisibility function so that it removes the 'show' class when the timer times out.
    toggleVisibility(hole);
    gameOver();
  }, delay); // change the setTimeout delay to the one provided as a parameter
  return timeoutID;
}

/**
*
* Adds or removes the 'show' class that is defined in styles.css to 
* a given hole. It returns the hole.
*
*/
function toggleVisibility(hole){
  // hole.classList.toggle adds or removes the 'show' class.
  hole.classList.toggle("show");
  return hole;
}

/**
*
* This function increments the points global variable and updates the scoreboard.
* Use the `points` global variable that is already defined and increment it by 1.
* After the `points` variable is incremented, updates the scoreboard.
*/
function updateScore() {
  points += 1;
  score.textContent = points;
  return points;
}

/**
* This function clears the score by setting `points = 0`. 
It also updates the board using `score.textContent = points`.
*/
function clearScore() {
  points = 0;
  score.textContent = points;
  return points;
}

/**
* Updates the control board with the timer if time > 0
*/
function updateTimer() {
  if (time > 0) {
    time -= 1;
    timerDisplay.textContent = time; // Assuming timerDisplay is defined somewhere
  } else {
    clearInterval(timer); // Stop the timer when time reaches 0
  }
}

/**
*
* Starts the timer using setInterval. For each 1000ms (1 second)
* the updateTimer function get called. This function is already implemented
*
*/
function startTimer() {
  timer = setInterval(updateTimer, 1000);
  return timer;
}

/**
*
* This is the event handler that gets called when a player
* clicks on a mole. The setEventListeners use this event
* handler (e.g. mole.addEventListener('click', whack)) for each of
* the moles.
*
*/

function whack(event) {
  updateScore();
  return points;
}

/**
*
* This function sets the duration of the game to 10 seconds. Duration is the time limit, in seconds,
* that a player has to click on the moles.
*
*/
function setDuration(duration) {
  time = duration;
  timerDisplay.textContent = time;
  return time;
}
/**
*
* This function is called when the game is stopped. It clears the
* timer using clearInterval. Returns "game stopped".
*
*/
function stopGame() {
  // clear the timer
  clearInterval(timer);
  startButton.textContent = "game over!";
  // start button displays game over!
  setTimeout(() => {
    startButton.textContent = "START GAME";
    startButton.disabled = false;
    timerDisplay.textContent = duration;
  }, 2000);
  return "game stopped";
}

/**
*
* This is the function that starts the game when the `startButton`
* is clicked.
*/
function startGame() {
  // disable the start button so the timer can't restart while game is in progress
  startButton.disabled = true;
  // start button text changes to git em! indicating game in progress
  startButton.textContent = "git em!";
  // previous score is cleared to zero when new game starts
  clearScore();
  setEventListeners();
  // duration time of the game is set to 10 seconds
  setDuration(duration);
  // start the timer countdown
  startTimer();
  // moles start showing up
  showUp();
  return "game started";
}
// start button eventListener
startButton.addEventListener('click', startGame);

/*
* Adds the 'click' event listeners to the moles. 
*/
function setEventListeners(){
  moles.forEach(
    mole => mole.addEventListener('click', whack)
  );
  return moles;
}




// Please do not modify the code below.
// Used for testing purposes.
window.randomInteger = randomInteger;
window.chooseHole = chooseHole;
window.setDelay = setDelay;
window.startGame = startGame;
window.gameOver = gameOver;
window.showUp = showUp;
window.holes = holes;
window.moles = moles;
window.showAndHide = showAndHide;
window.points = points;
window.updateScore = updateScore;
window.clearScore = clearScore;
window.whack = whack;
window.time = time;
window.setDuration = setDuration;
window.toggleVisibility = toggleVisibility;
window.setEventListeners = setEventListeners;
