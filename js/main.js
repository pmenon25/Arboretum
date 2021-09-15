const gridSize = 8;

let savedCard = null;


const game = {
    turn: 1,

    // Each turn consists of 3 phases/steps
    // Step 1: Draw 2 cards from play deck into your hand
    // Step 2: Play one card from your hand into your arboretum
    // Step 3: Discard a card from your hand into discard pile
    phase: 1,

    playDeck: {
        cards: [],
        shuffle: function () {
            for (let i = 0; i < this.cards.length; i++) {
                let temp = this.cards[i];
                let random = Math.floor(Math.random() * i);
                this.cards[i] = this.cards[random];
                this.cards[random] = temp;
            }
        },

        draw: function (n) {
            let drawCards = [];
            for (let i = 0; i < n; i++) {
                drawCards.push(this.cards.pop());
            }
            return drawCards;
        },

        populate: function () {
            let trees = ["A", "B", "C", "D", "E", "F"];
            let values = [1, 2, 3, 4, 5, 6, 7, 8];
            for (let i = 0; i < trees.length; i++) {
                for (let j = 0; j < values.length; j++) {
                    let card = new Card(j + 1, trees[i]);
                    this.cards.push(card);
                }
            }
        },
    },

    nextTurn: function () {
        this.turn = this.turn * -1;
        
        savedCard = null;
        
        if (game.turn === 1) {
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }

        currentPlayer.addCardsToPlayerHand(game.playDeck.draw(2));
    }
}

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

class Player {
    constructor(playerId) {
        let initialHand = game.playDeck.draw(7);

        this.handOfPlayer = [null, null, null, null, null, null, null, null, null];

        for (let i = 0; i < initialHand.length; i++) {
            this.handOfPlayer[i] = initialHand[i];
        }

        this.arboretumArray = [];

        for (let row = 0; row < gridSize; row++) {
            this.arboretumArray.push(new Array(gridSize));
        }

        // This player DOM id will be selected
        this.playerElement = document.getElementById(playerId);
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
        // addToPlayerHand help to make player hand deck
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

        // Selected player will access the child node
        let handElement = this.playerElement.children[1];

        makeInitialPlayerHand(handElement, this.handOfPlayer);
        handElement.addEventListener('click', cardPickHandler);
    }

    // renderPlayerArboretum function will show the  hplayer's arboretum table
    renderPlayerArboretum() {
        // addToPlayerArboretum help to make player arboretum
        function addToPlayerArboretum(playerElement) {
            for (let i = 0; i < gridSize * gridSize; i++) {
                let element = document.createElement('div');
                element.classList.add('slot');
                element.setAttribute('id', `cell${i + 1}`);
                playerElement.appendChild(element);
            }
        }
        // Selected player will access the child node
        let arboretumElement = this.playerElement.children[0];

        addToPlayerArboretum(arboretumElement);
        arboretumElement.addEventListener('click', cardPutHandler);
    }
}

// Player
//   - Hand
//     - Slot
//       - Card
//         - Value    <-
//         - Trees    <- 
//     - Slot
//     - Slot
//        ...
//   - Arboretum

function cardPickHandler(evt) {
    let parentPlayer = evt.target.parentNode.parentNode.parentNode.parentNode;
    let playerId = parentPlayer.getAttribute('id');

    if (game.turn === 1 && playerId !== 'player1') {
        return;
    } else if (game.turn === -1 && playerId !== 'player2') {
        return;
    } else {
        savedCard = evt.target.parentNode;

        let parentSlot = savedCard.parentNode;
        let parentHand = parentSlot.parentNode;

        for (let i = 0; i < parentHand.children.length; i++) {
            if (parentHand.children[i] === parentSlot) {
                // Update current player's handOfPlayer
            }
        }

        savedCard.remove();
    }
}

function cardPutHandler(evt) {
    let parentArboretum = evt.target.parentNode.parentNode;
    let parentArboretumId = parentArboretum.getAttribute('id');

    if (game.turn === 1 && parentArboretumId !== "player1") {
        return;
    } else if (game.turn === -1 && parentArboretumId !== 'player2') {
        return;
    } else if (savedCard === null) {
        alert('No card selected!')
    } else {
        evt.target.appendChild(savedCard);
    }
}

function undoCard(evt) {
    savedCard = null;
}

function init() {
    let currentPlayer;
    savedCard = null;
    
    game.playDeck.populate();
    game.playDeck.shuffle();

    document.getElementById('undo').addEventListener('click', undoCard);

    let player1 = new Player('player1');
    let player2 = new Player('player2');

    player1.render();
    player2.render();
}


init();