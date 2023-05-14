function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	deck = response.deck;
	currentCard = response.currentCard;
	canPlay = response.yourTurn;

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

		img.addEventListener('click', function(e)
		{
			clickACardInDeck(e);
		});

		deckDiv.appendChild(img);
	}
}

const logsDiv = document.getElementById('logsDiv');
function updateLog(text)
{
	logsDiv.innerText = text;
}

function clickACardInDeck(e)
{
	const card = e.target.attributes.card;

	if(canPlay) //Es tu turno
	{
		ws.send(JSON.stringify(
		{
			operation: 'play',
			roomID,
			username,
			play:
			{
				card
			}
		}));
	}
}