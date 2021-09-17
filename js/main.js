const gridSize = 8;

//savedCardObject will track the card picked from the hand(DOM) and the object
let savedCardObject = null;

let arboretumPhaseCompleted = false;
let discardPhaseCompleted = false;
let total = 0;

let scoringMode = false;

class Card {
    constructor(value, tree) {
        this.value = value;
        this.trees = tree;

    }

    /// <div class = "card">
    ///     <p class = "value">9</p>
    ///     <p class = "tree">A</p>
    /// </div>
    render() {
        let cardElement = document.createElement('div');
        cardElement.classList.add('card');

        let cardChildElement1 = document.createElement('p');
        cardChildElement1.classList.add('value');
        cardChildElement1.textContent = this.value;
        cardElement.appendChild(cardChildElement1);

        let cardChildElement2 = document.createElement('p');
        cardChildElement2.classList.add('tree');
        cardChildElement2.textContent = this.trees;
        cardElement.appendChild(cardChildElement2);

        return cardElement;
    }
}

class PlayDeck {
    constructor(trees, values) {
        this.trees = trees;
        this.values = values;
        this.cards = [];
        this.populate();
        this.shuffle();
    }

    shuffle() {
        for (let i = 0; i < this.cards.length; i++) {
            let temp = this.cards[i];
            let random = Math.floor(Math.random() * i);
            this.cards[i] = this.cards[random];
            this.cards[random] = temp;
        }
    }

    draw(n) {
        let drawCards = [];
        for (let i = 0; i < n; i++) {
            drawCards.push(this.cards.pop());
        }
        return drawCards;
    }

    populate() {
        for (let i = 0; i < this.trees.length; i++) {
            for (let j = 0; j < this.values.length; j++) {
                let card = new Card(j + 1, this.trees[i]);
                this.cards.push(card);
            }
        }
    }

    isPlaydeckEmpty() {
        if (this.cards.length === 0) {
            return true;
        } else {
            return false;
        }
    }
}


class Player {
    constructor(playerId, initialHand) {
        this.handOfPlayer = [null, null, null, null, null, null, null, null, null];

        for (let i = 0; i < initialHand.length; i++) {
            this.handOfPlayer[i] = initialHand[i];
        }

        //creating an array for the arboretum table
        this.arboretumArray = [];

        for (let row = 0; row < gridSize; row++) {
            this.arboretumArray.push([null, null, null, null, null, null, null, null]);
        }

        // This player DOM id will be selected
        this.playerElement = document.getElementById(playerId);

        // Selected player will access the child node (Hand class)
        this.handElement = this.playerElement.children[1];

        // Selected player will access the child node (arboretum class)
        this.arboretumElement = this.playerElement.children[0];

        // Whether this player has completed scoring their paths
        this.scoringCompleted = false;

        // Player's current score
        this.score = 0;

        // List of paths that player selected for scoring
        this.paths = [];

        // DOM elements of the path player selected for scoring
        this.pathElements = [];
    }

    render() {
        this.renderPlayerHand();
        this.renderPlayerArboretum();
    }

    // makeInitialPlayerHand help to make player hand deck
    makeInitialPlayerHand() {
        for (let i = 0; i < this.handOfPlayer.length; i++) {
            let element = document.createElement('div');
            element.classList.add('slot');

            if (this.handOfPlayer[i] !== null) {
                element.appendChild(this.handOfPlayer[i].render());
            }

            this.handElement.appendChild(element);
        }
    }

    // Put the drawn card in the empty place
    addCardsToPlayerHand(drawnCards) {
        for (let i = 0; i < this.handOfPlayer.length; i++) {
            // If slot in array is empty
            if (this.handOfPlayer[i] === null) {
                this.handOfPlayer[i] = drawnCards.pop();
                this.handElement.children[i].appendChild(this.handOfPlayer[i].render());
            }
        }
    }

    // addToPlayerArboretum help to make player arboretum
    addToPlayerArboretum() {
        for (let i = 0; i < gridSize * gridSize; i++) {
            let element = document.createElement('div');
            element.classList.add('slot');
            element.setAttribute('id', `cell${i + 1}`);
            this.arboretumElement.appendChild(element);
        }
    }

    // renderPlayerHand function will show the hand deck 
    renderPlayerHand() {
        this.makeInitialPlayerHand(this.handElement, this.handOfPlayer);
        this.handElement.addEventListener('click', cardPickHandler);
    }

    // renderPlayerArboretum function will show the  player's arboretum table
    renderPlayerArboretum() {
        this.addToPlayerArboretum(this.arboretumElement);
        this.arboretumElement.addEventListener('click', cardPutHandler);
    }
}


class Game {
    constructor() {
        const trees = ["A", "B", "C", "D", "E", "F"];
        const values = [1, 2, 3, 4, 5, 6, 7, 8];
        this.playDeck = new PlayDeck(trees, values);
        this.player1 = new Player('player1', this.playDeck.draw(7));
        this.player2 = new Player('player2', this.playDeck.draw(7));
        this.currentPlayer = null;
        this.currentPlayerName;
        this.discardArray = [];
        this.message = document.querySelector('.state');
    }

    switchPlayers() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
            this.currentPlayerName = "Player 2";
        } else {
            this.currentPlayer = this.player1;
            this.currentPlayerName = "Player 1";
        }
    }

    nextTurn() {
        this.switchPlayers();

        if (this.playDeck.isPlaydeckEmpty()) {
            this.message.innerHTML = "Game Over!";
            scoringMode = true;

            // Switch "Undo" to "Confirm Path" button when in scoring mode 
            let confirmPathButton = document.getElementById('undo');
            confirmPathButton.removeEventListener('click', undoCard);
            confirmPathButton.addEventListener('click', pathConfirmationHandler);
            confirmPathButton.innerHTML = "Confirm Path";

            // Switch "End Turn" to "End Scoring" button when in scoring mode
            let endScoringButton = document.getElementById('endTurn');
            endScoringButton.removeEventListener('click', endTurnHandler);
            endScoringButton.addEventListener('click', endScoringHandler);
            endScoringButton.innerHTML = "End Scoring";

            return;
        }

        arboretumPhaseCompleted = false;
        discardPhaseCompleted = false;
        savedCardObject = null;

        this.currentPlayer.addCardsToPlayerHand(this.playDeck.draw(2));

        // Pick card to play into arboretum
        this.message.innerHTML = `${this.currentPlayerName}: Pick a card to play into arboretum`;
    }

    render() {
        this.player1.render();
        this.player2.render();
    }

    // Check which player has the right to score which kind of paths
    checkRightToScore(tree) {
        // Check the sum of cards in each players hands of that tree type
        // 0 - both have right
        // 1 - player 1 has right
        // 2 - player 2 has right

        let player1Sum = 0;
        let player2Sum = 0;

        let player1HasOne = false, player1HasEight = false;
        let player2HasOne = false, player2HasEight = false;

        for (let i = 0; i < this.player1.handOfPlayer.length; i++) {

            if (this.player1.handOfPlayer[i] !== null) {

                if (this.player1.handOfPlayer[i].trees === tree) {
                    player1Sum += this.player1.handOfPlayer[i].value;

                    if (this.player1.handOfPlayer[i].value === 1) {
                        player1HasOne = true;
                    } else if (this.player1.handOfPlayer[i].value === 8) {
                        player1HasEight = true;
                    }
                }
            }

            if (this.player2.handOfPlayer[i] !== null) {
                if (this.player2.handOfPlayer[i].trees === tree) {
                    player2Sum += this.player2.handOfPlayer[i].value;

                    if (this.player2.handOfPlayer[i].value === 1) {
                        player2HasOne = true;
                    } else if (this.player2.handOfPlayer[i].value === 8) {
                        player2HasEight = true;
                    }
                }
            }

            if (player1HasOne === true && player2HasEight === true) {
                player2Sum -= 8;
            } else if (player1HasEight === true && player2HasOne === true) {
                player1Sum -= 8;
            }
        }

        if (game.currentPlayer === game.player1) {
            if (player1Sum >= player2Sum) {
                // Player 1 got the right to score this type of path
                return 1;
            }
        }

        if (game.currentPlayer === game.player2) {
            if (player2Sum >= player1Sum) {
                return 1;
            }
        }

        return 0;
    }
}

function cardPickHandler(evt) {
    // If both phases are completed don't allow picking any more cards
    if (arboretumPhaseCompleted && discardPhaseCompleted) {
        return;
    }

    // If we have already picked a card; don't allow picking another one.
    if (savedCardObject !== null) {
        return;
    }
    // cardElement selects the card class (parent of value and tree class) and playerElement selects the player class 
    let cardElement = evt.target.parentNode;
    let playerElement = cardElement.parentNode.parentNode.parentNode;
    let parentPlayerId = playerElement.getAttribute('id');

    if (game.currentPlayer === game.player1 && parentPlayerId !== 'player1') {
        return;
    } else if (game.currentPlayer === game.player2 && parentPlayerId !== 'player2') {
        return;
    }

    // Figure out position in hand array where card was picked from
    // slotElement selects the slot class and handElement selects hand class
    let slotElement = cardElement.parentNode;
    let handElement = slotElement.parentNode;
    let cardObject = null;

    for (let i = 0; i < handElement.children.length; i++) {
        if (handElement.children[i] === slotElement) {

            cardObject = game.currentPlayer.handOfPlayer[i];
            game.currentPlayer.handOfPlayer[i] = null;

            savedCardObject = cardObject;
            cardElement.remove();
            return;
        }
    }
}

function pathSelectionHandler(evt) {
    let clickedCardElement = evt.target.parentNode;
    let playerElement = clickedCardElement.parentNode.parentNode.parentNode;
    let playerElementId = playerElement.getAttribute("id");

    // Don't allow scoring if not the current player
    if (game.currentPlayer === game.player1 && playerElementId !== "player1") {
        return;
    } else if (game.currentPlayer === game.player2 && playerElementId !== 'player2') {
        return;
    }

    let targetRow = 0;
    let targetColumn = 0;

    for (let i = 0; i < game.currentPlayer.arboretumElement.children.length; i++) {
        if (clickedCardElement.parentNode === game.currentPlayer.arboretumElement.children[i]) {
            targetRow = Math.floor(i / 8);
            targetColumn = i % 8;
        }
    }

    // Highlight card
    clickedCardElement.classList.toggle('highlighted');

    game.currentPlayer.paths.push(game.currentPlayer.arboretumArray[targetRow][targetColumn]);
    game.currentPlayer.pathElements.push(clickedCardElement);
}

function pathConfirmationHandler(evt) {
    if (!game.currentPlayer.paths) {
        return;
    }

    // Remove highlighting for selected cards
    game.currentPlayer.pathElements.forEach(element => {
        element.classList.toggle('highlighted');
    });

    let oldValue = 0;
    let incompletePath = false;
    let firstCard = game.currentPlayer.paths[0];
    let lastCard = game.currentPlayer.paths[game.currentPlayer.paths.length - 1];

    // First and last card should be of same type for it to be a valid path
    if (firstCard.trees !== lastCard.trees) {
        return;
    }

    // Check if path is in increasing order of value of cards
    for (let i = 0; i < game.currentPlayer.paths.length; i++) {
        if (game.currentPlayer.paths[i].value > oldValue) {
            oldValue = game.currentPlayer.paths[i].value;
        } else {
            incompletePath = true;
        }
    }

    if (!incompletePath) {
        game.currentPlayer.score += game.checkRightToScore(firstCard.trees) * game.currentPlayer.paths.length;
    }

    game.message.innerHTML = `Player 1: ${game.player1.score} Player 2: ${game.player2.score}`;
}

function endScoringHandler(evt) {
    if (game.player1.scoringCompleted && game.player2.scoringCompleted) {
        let winner = "Tie";
        if (game.player1.score > game.player2.score) {
            winner = "Player 1";
        } else {
            winner = "Player 2";
        }

        game.message.innerHTML = `Winner: ${winner}!`;
        return;
    }

    game.currentPlayer.scoringCompleted = true;
    game.switchPlayers();
}

// Check if the target row and column is a valid location for the card
function isCorrectPlacement(targetRow, targetColumn) {
    let gridEmpty = true;
    for (let i = 0; i < game.currentPlayer.arboretumArray.length; i++) {
        for (let j = 0; j < game.currentPlayer.arboretumArray[i].length; j++) {
            if (game.currentPlayer.arboretumArray[i][j] !== null) {
                gridEmpty = false;
            }
        }
    }

    let up = targetRow - 1;
    let down = targetRow + 1;
    let right = targetColumn + 1;
    let left = targetColumn - 1;

    // conditions to check edges and corners.
    if (gridEmpty) {
        return true;
    } else {
        if (up < 0) {
            up = 0;
        } else if (down > (gridSize - 1)) {
            down = gridSize - 1;
        }

        if (left < 0) {
            left = 0;
        } else if (right > (gridSize - 1)) {
            right = gridSize - 1;
        }
        // Checks all the four adjacent position with respect to the previous card to be empty.
        if (game.currentPlayer.arboretumArray[down][targetColumn] !== null ||
            game.currentPlayer.arboretumArray[up][targetColumn] !== null ||
            game.currentPlayer.arboretumArray[targetRow][right] !== null ||
            game.currentPlayer.arboretumArray[targetRow][left] !== null) {
            return true;
        }
    }

    return false;
}

function cardPutHandler(evt) {

    let clickedElement = evt.target;
    // Ensures that card will be placed only in the empty slot
    if (clickedElement.className !== "slot") {
        // If we are in scoring mode - allow clicking only on cards i.e. no empty slots
        if (scoringMode === true) {
            pathSelectionHandler(evt);
        }
        return;
    }

    let playerElement = evt.target.parentNode.parentNode;
    let playerElementId = playerElement.getAttribute('id');

    if (arboretumPhaseCompleted === true) {
        return;
    }

    if (game.currentPlayer === game.player1 && playerElementId !== "player1") {
        return;
    } else if (game.currentPlayer === game.player2 && playerElementId !== 'player2') {
        return;
    } else if (savedCardObject === null) {
        alert('No card selected!')
    } else {
        let targetRow = 0;
        let targetColumn = 0;

        for (let i = 0; i < game.currentPlayer.arboretumElement.children.length; i++) {
            if (clickedElement === game.currentPlayer.arboretumElement.children[i]) {
                targetRow = Math.floor(i / 8);
                targetColumn = i % 8;
            }
        }

        // Check if placement is valid
        // If invalid, don't allow placing the card here
        // If valid, update the arboretumArray and insert card element
        if (isCorrectPlacement(targetRow, targetColumn)) {

            game.currentPlayer.arboretumArray[targetRow][targetColumn] = savedCardObject;
            clickedElement.appendChild(savedCardObject.render());
            savedCardObject = null;
            arboretumPhaseCompleted = true;

            // Pick card from hand to discard
            game.message.innerHTML = `${game.currentPlayerName}: Pick a card to place in discard pile`;

        }
    }
}

function findHolesinHand() {
    let hand = game.currentPlayer.handOfPlayer;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i] === null) {
            return i;
        }
    }
}

function undoCard(evt) {
    if (savedCardObject !== null) {
        let emptySlotIndex = findHolesinHand();
        let slotElement = game.currentPlayer.handElement.children[emptySlotIndex];

        game.currentPlayer.handOfPlayer[emptySlotIndex] = savedCardObject;
        slotElement.appendChild(savedCardObject.render());

        savedCardObject = null;
    }
}

document.getElementById('discardDeck').addEventListener('click', function (evt) {
    if (savedCardObject === null) {
        return;
    }
    game.discardArray.push(savedCardObject);
    savedCardObject = null;
    discardPhaseCompleted = true;
    game.message.innerHTML = `${game.currentPlayerName}: End your Turn`;
});


function endTurnHandler(evt) {
    if ((arboretumPhaseCompleted === true) && (discardPhaseCompleted === true)) {
        game.nextTurn();
    } else {
        game.message.innerHTML = `${game.currentPlayerName}: Cannot end Turn`;
        return;
    }
}

const game = new Game();

function init() {
    document.getElementById('undo').addEventListener('click', undoCard);
    document.getElementById('endTurn').addEventListener('click', endTurnHandler);
    game.render();
    game.nextTurn();
}

init();