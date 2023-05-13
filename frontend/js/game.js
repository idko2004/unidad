function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	deck = response.deck;
	currentCard = response.currentCard;

	updateCurrentCard(response.currentCard);
	createCardsInDeck(response.deck);
	updateLog(response.message);
}

const currentCardImg = document.getElementById('currentCard');
const deckDiv = document.getElementById('deck');

function updateCurrentCard(card)
{
	currentCardImg.src = `img/${card}.png`;
}

function createCardsInDeck(deck)
{
	for(let i = 0; i < deck.length; i++)
	{
		const img = document.createElement('img');
		img.classList.add('cardInDeck');
		img.classList.add('cardHoverAnim');

		img.src = `img/${deck[i]}.png`;
		img.setAttribute('card', deck[i]);

		deckDiv.appendChild(img);
	}
}

const logsDiv = document.getElementById('logsDiv');
function updateLog(text)
{
	logsDiv.innerText = text;
}