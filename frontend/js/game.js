function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	playerDeck = response.deck;
	currentCard = response.currentCard;
	canPlay = response.yourTurn;

	updateCurrentCard(response.currentCard);
	createCardsInDeck(response.deck);
	newMessages(response.message);
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
	moveAddCardToLast();
}

const logsDiv = document.getElementById('logsDiv');
let messagesPending = [];
let updateMessageJob;

function newMessages(messages)
{
	if(!Array.isArray(messages)) return;

	messagesPending.push(messages);

	updateMessageJob = setInterval(function()
	{
		if(messagesPending.length > 0)
		{
			updateLog(messagesPending[0]);
			messagesPending.shift();
		}
		else
		{
			clearInterval(updateMessageJob);
		}
	}, 500);
}

function updateLog(text)
{
	logsDiv.innerText = text;
}

function clickACardInDeck(e)
{
	const card = e.target.attributes.card.value;
	//e.target.hidden = true;

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

function errorPlaying(response)
{
	switch(response.error)
	{
		default:
			floatingWindow(
			{
				title: 'Algo salió mal',
				text: `error: ${response.error}`,
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'invalidCard':
			floatingWindow(
			{
				title: 'Esa carta no',
				text: 'Elige una carta que tenga el mismo color o contenido',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;
	}
}

function gameUpdate(response)
{
	updateCurrentCard(response.currentCard);
	newMessages(response.messages);
	updateDeck(response.deck);
	
	canPlay = response.yourTurn;

	changeSkipCondition(false);
	canGrabACard = true;
}

function updateDeck(deck)
{
	console.log('old deck', JSON.stringify(playerDeck));
	console.log('how new is supposed to be', JSON.stringify(deck));
	playerDeck = [].push(deck);

	const elementsInDeck = document.getElementsByClassName('cardInDeck');

	const pairedCards = [];

	for(let i = 0; i < deck.length; i++)
	{
		// Por cada elemento de la array del deck, buscar una carta en el html que se corresponda
		const deckElement = findCard(deck[i]);
		pairedCards.push(deckElement);
		deck[i] = null;

		// Todos los elementos de deck que no sean null son cartas nuevas
		// Todas las cartas html que no están paireadas deben ser eliminadas
	}

	removeCards();
	addCards();
	moveAddCardToLast();

	function findCard(card)
	{
		for(let j = 0; j < elementsInDeck.length; j++)
		{
			if(card === elementsInDeck[j].attributes.card.value
			&& !pairedCards.includes(elementsInDeck[j]))
			{
				return elementsInDeck[j];
			}
		}
	}

	function removeCards()
	{
		let toRemove = [];
		for(let j = 0; j < elementsInDeck.length; j++)
		{
			if(!pairedCards.includes(elementsInDeck[j]))
			{
				toRemove.push(elementsInDeck[j]);
			}
		}

		toRemove.forEach(function(e)
		{
			e.remove();
		});
	}

	function addCards()
	{
		let toAdd = [];
		for(let j = 0; j < deck.length; j++)
		{
			if(deck[j] !== null) toAdd.push(deck[j]);
		}

		createCardsInDeck(toAdd);
	}
}

function moveAddCardToLast()
{
	const parent = document.getElementById('deck');
	const card = document.getElementById('addCard');

	parent.appendChild(card);
}

const skipButton = document.getElementById('skipButton');
function changeSkipCondition(nowCanSkip)
{
	if(typeof nowCanSkip !== 'boolean') return;

	canSkip = nowCanSkip;

	skipButton.disabled = !nowCanSkip;
}

//La carta de pedir más cartas
document.getElementById('addCard').addEventListener('click', function()
{
	if(!canPlay || canSkip || !canGrabACard) return;

	ws.send(JSON.stringify(
	{
		operation: 'grabCard',
		roomID,
		username
	}));
});

function grabCard(response)
{
	if(response.error !== undefined)
	{
		if(response.error === 'alredyGrabbed')
		{
			floatingWindow(
			{
				title: 'Nop',
				text: 'Ya has tomado una carta.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			return;
		}
		else
		{
			floatingWindow(
			{
				title: 'Algo salió mal',
				text: `error: ${response.error}`,
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			return;
		}
	}

	const card = response.card;
	createCardsInDeck([card]);
	playerDeck.push(card);
	changeSkipCondition(true);
	canGrabACard = false;
}