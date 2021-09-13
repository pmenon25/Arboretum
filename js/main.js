class Card {
    constructor(value, trees) {
        this.value = value;
        this.trees = trees;

    }
}

const game = {
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
                for (let j = 1; j <= values.length; j++) {
                    let card = new Card(j, trees[i]);
                    this.cards.push(card);
                }
            }
        }
    }

}

let turn = 1;
let playerHand = null;


function init() {
    game.playDeck.populate();
    game.playDeck.shuffle();
    game.playDeck.draw(7);
}
init();


// addToPlayerGrid help to make player arboretum
function addToPlayerGrid(player) {
    for (let i = 1; i <= 32*32; i++) {
        let element = document.createElement('div');
        element.setAttribute('id', `cell${i}`);
        player.appendChild(element);
    }
}

let players = document.getElementsByClassName('player');
for (let i = 0; i < players.length; ++i) {
    addToPlayerGrid(players[i]);
}