function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	//playerDeck = response.deck;
	canPlay = response.yourTurn;

	updateCurrentCard(response.currentCard);
	createCardsInDeck(response.deck);
	newMessages(response.message);
	updateBackgroundColor(response.yourTurn);

	playerDeck = response.deck;
}


//const deckElement = document.getElementById('deck');
const addCardElement = document.getElementById('addCard');

function changeSkipCondition(nowCanSkip)
{
	if(typeof nowCanSkip !== 'boolean') return;

	canSkip = nowCanSkip;

	if(nowCanSkip)
	{
		addCardElement.children[0].classList.remove('card-ADD');
		addCardElement.children[0].classList.add('card-SKIP');
	}
	else
	{
		addCardElement.children[0].classList.remove('card-SKIP');
		addCardElement.children[0].classList.add('card-ADD');
	}
}

//La carta de pedir más cartas y saltar turno
document.getElementById('addCard').addEventListener('click', function()
{
	if(!canPlay) return;

	if(canSkip || canSkipDirectly)
	{
		changeSkipCondition(false);
		ws.send(JSON.stringify(
		{
			operation: 'skip',
			roomID,
			key
		}));
		window.scroll({top: 0, behavior: 'smooth'});
	}
	else if(canGrabACard)
	{
		ws.send(JSON.stringify(
		{
			operation: 'grabCard',
			roomID,
			key
		}));
	}
});
