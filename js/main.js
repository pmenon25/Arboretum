const gridSize = 8;

let savedCard = null;

const game = {
    turn: 1,

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

        nextTurn: function() {
        }
    }

}

class Card {
    constructor(value, tree) {
        this.value = value;
        this.trees = tree;

    }
    render() {

    }
}


class Player {
    constructor(playerId) {
        this.handOfPlayer = game.playDeck.draw(7);
        this.arboretum = [];

        //This player DOM id will be selected
        this.playerElement = document.getElementById(playerId);
    }

    makeArboretum() {
        for (let row = 0; row < gridSize; row++) {
            this.arboretum.push(new Array(gridSize));
        }

    }
    render() {
        this.renderPlayerHand();
        this.renderPlayerArboretum();
    }


    placeCardInToArboretum(card) {
        // playing for the first time and all the grids are cells are empty then place the first card in the middle of the grid
        let isGridEmpty = true;
        for (let row = 0; row < this.arboretum.length; row++) {
            for (let col = 0; col < this.arboretum[row].length; col++) {
                if (this.arboretum[row][col] !== null) {
                    isGridEmpty = false;
                }
            }
        }

        if (isGridEmpty) {
            this.arboretum[gridSize / 2][gridSize / 2] = card;
        }
    }

    // renderPlayerHand function will show the  hand deck 
    renderPlayerHand() {
        // addToPlayerHand help to make player hand deck
        function addToPlayerHand(hand) {
            for (let i = 0; i < 8; i++) {
                let element = document.createElement('div');
                element.classList.add('slot');
                hand.appendChild(element);
            }
        }
        // Selected player will access the child node
        let handElement = this.playerElement.children[1];


        addToPlayerHand(handElement);
        handElement.addEventListener('click', cardPickHandler);
    }

    // renderPlayerArboretum function will show the  hplayer's arboretum table
    renderPlayerArboretum() {
        // addToPlayerArboretum help to make player arboretum
        function addToPlayerArboretum(player) {
            for (let i = 0; i < gridSize * gridSize; i++) {
                let element = document.createElement('div');
                element.classList.add('slot');
                element.setAttribute('id', `cell${i + 1}`);
                player.appendChild(element);
            }
        }
        // Selected player will access the child node
        let arboretumElement = this.playerElement.children[0];


        addToPlayerArboretum(arboretumElement);
        arboretumElement.addEventListener('click', cardPutHandler);
    }
}

function cardPickHandler(evt) {
    let select = evt.target.parentNode.parentNode;
    let selectEl = select.getAttribute('id');
    savedCard = evt.target;
    console.log(savedCard)
}

function cardPutHandler(evt) {
    if (savedCard === null) {
        alert('No card selected!')
    }
    console.log('put')
}

function undoCard(evt) {
    savedCard = null;
}

function init() {
    game.playDeck.populate();
    game.playDeck.shuffle();
    game.playDeck.draw(7);

    let player1 = new Player('player1');
    let player2 = new Player('player2');

    player1.render();
    player2.render();

    document.getElementById('undo').addEventListener('click', undoCard);

}

init();