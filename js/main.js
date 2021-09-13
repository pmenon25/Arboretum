


// addToPlayerGrid help to make player arboretum
function addToPlayerGrid(player) {
    for (let i = 1; i <= 32 ; i++){
        let element = document.createElement('div');
        element.setAttribute('id' , `cell${i}`);
        player.appendChild(element);
    }
}

let players = document.getElementsByClassName('player');
for (let i = 0; i < players.length; ++i) {
    addToPlayerGrid(players[i]);
}