const gridSize = 8;

// SavedCard   SavedSlot
//   null          null         - No card picked; no undo available
//   null          !null        - No card picked; but undo available
//   !null          null        - Card picked; but no undo available
//   !null          !null       - Card picked and undo available (b)

let savedCardObject = null;

let arboretumPhaseCompleted = false;
let discardPhaseCompleted = false;

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
    constructor() {
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
        let trees = ["A", "B", "C", "D", "E", "F"];
        let values = [1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = 0; i < trees.length; i++) {
            for (let j = 0; j < values.length; j++) {
                let card = new Card(j + 1, trees[i]);
                this.cards.push(card);
            }
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

        // Selected player will access the child node
        this.handElement = this.playerElement.children[1];

        // Selected player will access the child node
        this.arboretumElement = this.playerElement.children[0];
    }

    render() {
        this.renderPlayerHand();
        this.renderPlayerArboretum();
    }

    addCardsToPlayerHand(drawnCards) {
        let handElement = this.playerElement.children[1];
        for (let i = 0; i < handElement.children.length; i++) {
            // If slot in array is empty
            if (this.handOfPlayer[i] === null) {
                let emptySlotElement = handElement.children[i];
                let card = drawnCards.pop();

                this.handOfPlayer[i] = card;
                emptySlotElement.appendChild(card.render());
            }
        }
    }

    // renderPlayerHand function will show the hand deck 
    renderPlayerHand() {
        // makeInitialPlayerHand help to make player hand deck
        function makeInitialPlayerHand(hand, handArray) {
            for (let i = 0; i < handArray.length; i++) {
                let element = document.createElement('div');
                element.classList.add('slot');

                if (handArray[i] !== null) {
                    let card = handArray[i];
                    element.appendChild(card.render());
                }

                hand.appendChild(element);
            }
        }

        makeInitialPlayerHand(this.handElement, this.handOfPlayer);
        this.handElement.addEventListener('click', cardPickHandler);
    }

    // renderPlayerArboretum function will show the  player's arboretum table
    renderPlayerArboretum() {
        // addToPlayerArboretum help to make player arboretum
        function addToPlayerArboretum(arboretumElement) {
            for (let i = 0; i < gridSize * gridSize; i++) {
                let element = document.createElement('div');
                element.classList.add('slot');
                element.setAttribute('id', `cell${i + 1}`);
                arboretumElement.appendChild(element);
            }
        }

        addToPlayerArboretum(this.arboretumElement);
        this.arboretumElement.addEventListener('click', cardPutHandler);
    }

}

class Game {
    constructor() {
        this.playDeck = new PlayDeck();
        this.player1 = new Player('player1', this.playDeck.draw(7));
        this.player2 = new Player('player2', this.playDeck.draw(7));
        this.currentPlayer = this.player1;
        
    }

    nextTurn() {
        this.turn = this.turn * -1;
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }

        // currentPlayer.addCardsToPlayerHand(game.playDeck.draw(2));
    }

    render() {
        this.player1.render();
        this.player2.render();
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

    let cardElement = evt.target.parentNode;
    let playerElement = cardElement.parentNode.parentNode.parentNode;
    let parentPlayerId = playerElement.getAttribute('id');

    if (game.currentPlayer === game.player1 && parentPlayerId !== 'player1') {
        return;
    } else if (game.currentPlayer === game.player2 && parentPlayerId !== 'player2') {
        return;
    }

    // Figure out position in hand array where card was picked from
    let slotElement = cardElement.parentNode;
    let handElement = slotElement.parentNode;
    let cardObject = null;

    for (let i = 0; i < handElement.children.length; i++) {
        if (handElement.children[i] === slotElement) {

            cardObject = game.currentPlayer.handOfPlayer[i];
            game.currentPlayer.handOfPlayer[i] = null;

            savedCardObject = cardObject;
            cardElement.remove();

            console.log(game.currentPlayer.handOfPlayer);
            return;
        }
    }
}

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

    if (clickedElement.className !== "slot") {
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
        }

        console.log(game.currentPlayer.arboretumArray);
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

document.getElementById('discardDeck').addEventListener('click' , function(evt){
    savedCardObject = null;
   
})

const game = new Game();

function init() {
    document.getElementById('undo').addEventListener('click', undoCard);
    game.render();
    // game.nextTurn();
}



init();