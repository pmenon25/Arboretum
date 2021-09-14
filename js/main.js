class Card {
    constructor(value, tree) {
        this.value = value;
        this.trees = tree;

    }
}

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
        }
    }

}


class Player {
    constructor() {
        this.handOfPlayer = game.playDeck.draw(7);
        this.arboretum = [];
    }

    makeArboretum() {
        for (let row = 0; row < 32; row++) {
            this.arboretum.push(new Array(32));
        }

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
            this.arboretum[16][16] = card;
        }
    }    
}


function drawPlayerArboretums() {
    // addToPlayerArboretum help to make player arboretum
    function addToPlayerArboretum(player) {
        for (let i = 0; i < 32 * 32; i++) {
            let element = document.createElement('div');
            element.setAttribute('id', `cell${i + 1}`);
            player.appendChild(element);
        }
    }

    let players = document.getElementsByClassName('player');
    for (let i = 0; i < players.length; ++i) {
        addToPlayerArboretum(players[i]);
    }
}

function drawPlayerHands() {
    // addToPlayerHand help to make player hand deck
    function addToPlayerHand(hand) {
        for (let i = 0; i < 8; i++) {
            let element = document.createElement('div');
            element.classList.add('card');
            element.setAttribute('id', `hand${i + 1}`);
            hand.appendChild(element);
        }
    }

    let hands = document.getElementsByClassName('hand');
    for (let i = 0; i < hands.length; i++) {
        addToPlayerHand(hands[i]);
    }
}

function init() {
    game.playDeck.populate();
    game.playDeck.shuffle();
    game.playDeck.draw(7);

    drawPlayerArboretums();
    drawPlayerHands();
}

init();