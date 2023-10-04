


//array of colors to select the colors for the cards
// const COLORS = [
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "purple",
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "purple"
// ];


//declare variable 'gameConatainer' as a reference to the HTML div with the id of 'game'
const gameContainer = document.getElementById("game");
//button and functions to add 2 more cards at a time

let numOfCards = 10; 
function addCards() {
  numOfCards += 2;
  console.log(`Number of cards: ${numOfCards}`)
  resetGame();
}
const cardButton = document.getElementById('cardButton');
cardButton.addEventListener("click", addCards); 
 

//generate a random color 
function generateRandomColor() {
//string of characters for hexadecimal colors
  const letters = "0123456789ABCDEF";
//put # at the start of the hexadecimal code
  let color = "#";
//loop 6 times for each digit in a hexadecimal color code
  for (let i = 0; i < 6; i++) {
//select random characters from the letters string to make a random color
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// generate an array of colors
function generateColors(numCards) {
//declare empty array
  const colors = [];
//loop to generate a pair of colors
  for (let i = 0; i < numCards / 2; i++) {
//call geneRateRandomColor and store it as randomColor
    const randomColor = generateRandomColor();
//randomColor is pushed twice into the colors array to put pairs into the array
    colors.push(randomColor, randomColor); // Pairs of colors
  }
  return shuffle(colors);
}



let COLORS = generateColors(numOfCards);



//variable set to false to keep track of whether a card is flipped
let hasFlippedCard = false;
//variable set to false to prevent flipping more than two cards at once
let lockBoard = false;
//used to keep track of the first and second card flipped during a turn
let firstCard, secondCard;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
//store the shuffled colors in this variable
let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}



// TODO: Implement this function!
function handleCardClick(event) {
  if (!gameStarted || lockBoard) return;
//checks if lockbard is true, if it is then rest of the function doesnt run
  // if (lockBoard) return;
//retrieves the HTML element that is clicked on and assigns it to the card variable
  const card = event.target;
//checks that the second clicked card is not the same card that was already flipped, also checks if the clicked card has already been matched
  if (card === firstCard || card.classList.contains("matched")) return;
  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);
//gets the classlist (color) of the clicked card and assigns it to the colorClass variable
  const colorClass = card.classList[0];
//changes the background color of the card to its color class
  card.style.backgroundColor = colorClass;
//checks if its the first card flipped in the current turn
  if (!hasFlippedCard) {
//if it is the first card flipped set hasFlippedCard to true to show that one card has already been flipped
    hasFlippedCard = true;
//assgins the clicked card to a variable to it can be compared to the second card
    firstCard = card;
  } else { //if its the second card flipped, run this code
//reset hasFlippedCard to false to indicate that two cards have been flipped this turn
    hasFlippedCard = false;
//assign the second card
    secondCard = card;
//calls the function to check for matching colors
    checkForMatch();
  }
}



//declare gameStarted as false
let gameStarted = false;

const startButton = document.getElementById('startButton');
//add a click event listener to the game and run the startGame function which changes gameStarted to true
startButton.addEventListener('click', function () {
  startGame();
  alert('The Game Has Begun')
});

function startGame() {
  gameStarted = true;
  resetGame();
}



function updateGameStatus() {
//reference the HTML element where the guesses are stored
  const gameStatus = document.getElementById('gameStatus');
//update the text of the html element to reflect the current amount of guesses
  gameStatus.textContent = `Guesses: ${guesses}`;
}


let matchedPairs = 0;
let guesses = 0;
let lowestGuesses = 0;


//function to remove the ability to click cards once theyve been matched
function disableCards() {
  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
//function to reset for the next turn
  resetBoard();
}


function checkForMatch() {
//declare variables equal to the color of the card
  const color1 = firstCard.style.backgroundColor;
  const color2 = secondCard.style.backgroundColor;
//add 1 to the the guesses counter
  guesses++;
  if (color1 === color2) {
//if the cards match call the disableCards function to make sure they cant be clicked again
    console.log('The colors were a match');
    disableCards();
//add 1 to the matchedPairs counter
    matchedPairs++;
//if matchedPairs is equal to run an alert letting the player know theyve won
    if (matchedPairs === COLORS.length / 2) {
      setTimeout(function () {
        alert('You Won!');
//save the lowest amount of guesses to localstorage
        if (guesses < lowestGuesses || lowestGuesses === 0) {
          lowestGuesses = guesses;
          saveGuesses(lowestGuesses);
          
        }
      }, 200); 
    }

  } else {
    unFlipCards();
  }
  updateGameStatus();
}



function unFlipCards() {
//keeps the player from flipping more cards
  lockBoard = true;
  setTimeout(function () {
//after 1 second hide the colors of the flipped cards if they dont match
    firstCard.style.backgroundColor = "";
    secondCard.style.backgroundColor = "";
    resetBoard();
  }, 1000)
}

// Function to save the lowest guesses in local storage
function saveGuesses(lowestGuesses) {
  localStorage.setItem('lowestGuesses', lowestGuesses.toString());
}

// Function to retrieve the lowest guesses from local storage
function getGuesses() {
//retrieve the lowest amount of guesses from local storage
  const lowestGuesses = localStorage.getItem('lowestGuesses');
//checks to see if a value is stored or not
  if (lowestGuesses === null) {
    return Infinity; // if no value is stored return a high value
  }
//parseInt lowestGuesses to return it as an integer
  return parseInt(lowestGuesses);
}

function resetBoard() {
//update two variables to false
  [hasFlippedCard, lockBoard] = [false, false];
//set two variables to null so new can store the next value of cards
  [firstCard, secondCard] = [null, null];
}

const resetButton = document.getElementById("resetButton");
//add a click event listener to the reset button
resetButton.addEventListener("click", resetGame);
//function to reset the game
function resetGame() {
  guesses = 0;
  matchedPairs = 0;
  //remove all cards from the game container
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  COLORS = generateColors(numOfCards);
  //shuffle the colors array again
  shuffledColors = shuffle(COLORS);
  //re-create the cards with the shuffled colors
  createDivsForColors(shuffledColors);
  updateGameStatus();
}

createDivsForColors(shuffledColors);
