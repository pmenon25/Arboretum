# Arboretum
Arboretum is a strategy card game  that combines tile-laying and hand management . Players try to have the most points at the end of the game. The deck has 48 cards in six different species(in our case species are named from A through F , each species has cards numbered 1 through 8.On the begining of the game each player will have 7 cards and on each turn  player draws two cards from the deck , plays a card to the arboretum table and finally discards a card to discard pile.The game ends when play deck is exhausted.

##  How to play

![screenshot](images/Screenshot-Arboretum.png)

The game is divided into 2 modes:
- **Play Mode:** Players take turns playing and discarding cards in phases  as described below
- **Scoring Mode:** After you run out of cards in the playdeck the game switches to Scoring Mode. Both players take turns marking paths and gathering points from their Arboretum.

### Play Mode
- Draw 2 cards
	- Two Cards will be drawn from the face-down play deck and placed to the player's hand.
- Play a card from your hand into your Arboretum
     - On your first turn, place a card from your hand into the Arboretum grid. This is the start of your Arboretum.
     - You can undo your card selection after picking a card but not after placing it in the Arboretum or the Discard Pile.
     - In the following turns cards must be placed adjacent (horizontally or vertically) to previously placed cards.
- Discard a card
	- At the end of your turn, you must discard a card into your discard pile so that you have exactly 7 cards left in your hand.

### Scoring Mode
When the playdeck runs out of cards the game is over and both players can now take turns gathering points for creating paths in their Arboretum.

A **path** is a consecutive sequence of cards which begin and end in a card with the same letter. For a path to be considered valid each card in the path should have a number greater than the previous card in the path. Example: *A-1 B-3 C-5 A8* is a valid path but *A-1 B-3 C-5* alone is not since it does not end in a card of the same letter (A).

Before being able to score a *path* the player must win the **right to score** it. This is determined by whoever holds the highest sum of cards of that type in their hand. An exception to this rule is if one player holds a 1 of that type of card and the other holds an 8. In this case, the 1 cancels out the 8 which is treated as a 0 for the purposes of determining the right to score.

Scoring proceeds in two phases:
- **Phase 1**: Players highlight a valid path by clicking on cards placed in their Arboretum.
	- Note that cards *must* be selected in the order described above i.e. lowest numbered card must be selected first and highest numbered card of the same type must be selected last.
	- The cards will highlight in yellow to show a valid selection.
	- Once a path has been selected click "Confirm Path" to score that sequence.
	- Your live score will appear at the top of the page as each highlighted path is scored.

- **Phase 2**: After scoring all valid paths in their Arboretums players can click "End Scoring" to lock in their score. After both players have locked in their scores the winner will be displayed near the top of the page.

NOTE: Cards currently cannot be deselected. This is known limitation of the current website.

### Technologies Used
- HTML
-  CSS 
-  JavaScript

### Getting Started:
You can play the game here : https://pmenon25.github.io/Arboretum/

### Icebox Items:
- Allow picking from Discard pile
- Improve scoring mode selections

### Reference:
* Google Fonts
* [[https://css-tricks.com/snippets/css/complete-guide-grid/|CSS Tricks]]