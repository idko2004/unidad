function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	playerDeck = response.deck;
	canPlay = response.yourTurn;

	updateCurrentCard(response.currentCard);
	createCardsInDeck(response.deck);
	newMessages(response.message);
}

function createCardsInDeck(deck)
{
	for(let i = 0; i < deck.length; i++)
	{
		const img = document.createElement('img');
		img.classList.add('cardInDeck');
		img.classList.add('cardHoverAnim');
		img.classList.add('card-spawn');

		img.src = `img/${deck[i]}.png`;
		img.setAttribute('card', deck[i]);

		img.addEventListener('click', function(e)
		{
			clickACardInDeck(e);
		});

		img.addEventListener('animationend', function(e)
		{
			cardAnimationEnd(e);
		});

		deckDiv.appendChild(img);
	}
	//moveAddCardToLast();
}

const logsDiv = document.getElementById('logsDiv');
let messagesPending = [];
let updateMessageJob;
let waitMessageTime = 1_200;
let lastMessageChanged;

function newMessages(messages)
{
	console.log('newMessages', messages);
	if(!Array.isArray(messages)) return;

	messagesPending = messages;

	if(updateMessageJob !== undefined)
	{
		clearInterval(updateMessageJob);
	}

	updateMessageJob = setInterval(function()
	{
		updateMessage();
	}, waitMessageTime);

	updateMessage();
}

function updateMessage()
{
	if(messagesPending.length > 0)
	{
		console.log('Changing message', messagesPending[0]);
		logsDiv.innerText = messagesPending[0];
		messagesPending.shift();
	}
	else
	{
		clearInterval(updateMessageJob);
		updateMessageJob = undefined;
	}
}

function clickACardInDeck(e)
{
	const card = e.target.attributes.card.value;

	if(!validCard(card, currentCard))
	{
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
		return;
	}

	if(canPlay) //Es tu turno
	{
		window.scroll({top: 0, behavior: 'smooth'});

		switch(card)
		{
			default:
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
				break;

			case 'COLOR':
				openColorWindow();
				break;
		}
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

		case 'grabCardFirst':
			floatingWindow(
			{
				title: 'Toma una carta del mazo',
				text: 'No puedes saltar tu turno si no tomas una carta del mazo antes',
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

	canSkipDirectly = response.canSkipDirectly;
	changeSkipCondition(response.canSkipDirectly || false);
	canGrabACard = !response.canSkipDirectly || true;
}

function updateDeck(deck)
{
	console.log('old deck', JSON.stringify(playerDeck));
	console.log('how new is supposed to be', JSON.stringify(deck));
	playerDeck = JSON.parse(JSON.stringify(deck));

	const elementsInDeck = document.getElementsByClassName('cardInDeck');

	const pairedCards = [];

	for(let i = 0; i < deck.length; i++)
	{
		// Por cada elemento de la array del deck, buscar una carta en el html que se corresponda
		const deckElement = findCard(deck[i]);
		if(deckElement !== undefined)
		{
			pairedCards.push(deckElement);
			deck[i] = null;
		}

		// Todos los elementos de deck que no sean null son cartas nuevas
		// Todas las cartas html que no están paireadas deben ser eliminadas
	}

	console.log(pairedCards);
	console.log(deck);

	removeCards();
	addCards();
	//moveAddCardToLast();

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
		console.log('updateDeck.findCard: no se pudo encontrar la carta');
		return undefined;
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
			e.classList.add('card-delete');
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

const deckElement = document.getElementById('deck');
const addCardElement = document.getElementById('addCard');

/*
function moveAddCardToLast()
{
	return;
	const parent = deckElement;
	const card = addCardElement;

	parent.appendChild(card);
}
*/

function changeSkipCondition(nowCanSkip)
{
	if(typeof nowCanSkip !== 'boolean') return;

	canSkip = nowCanSkip;

	if(nowCanSkip) addCardElement.src = 'img/skipturn.png';
	else addCardElement.src = 'img/add.png';
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
			username
		}));
		window.scroll({top: 0, behavior: 'smooth'});
	}
	else if(canGrabACard)
	{
		ws.send(JSON.stringify(
		{
			operation: 'grabCard',
			roomID,
			username
		}));
	}
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
	console.log('deck después de agarrar una carta', playerDeck);
	changeSkipCondition(true);
	canGrabACard = false;
}

// Cards animations
function cardAnimationEnd(e)
{
	switch(e.animationName)
	{
		case 'cardSpawnAnim':
			e.target.classList.remove('card-spawn');
			break;

		case 'cardDeleteAnim':
			e.target.remove();
			break;
	}
}

// Current card animation
const currentCardImg = document.getElementById('currentCard');
const deckDiv = document.getElementById('deck');

currentCardImg.addEventListener('animationend', function(e)
{
	switch(e.animationName)
	{
		case 'cardDeleteAnim':
			currentCardImg.classList.remove('currentCard-out');
			currentCardImg.src = `img/${currentCard}.png`;
			currentCardImg.classList.add('currentCard-in');
			break;

		case 'currentCardInAnim':
			currentCardImg.classList.remove('currentCard-in');
			break;
	}
});

function updateCurrentCard(card)
{
	if(card === currentCard) return; //Si la carta es igual, no hacer animación
	if(currentCardImg.src !== '') currentCardImg.classList.add('currentCard-out'); //Si no hay carta anterior, no hacer animación
	else currentCardImg.src = `img/${card}.png`;
	currentCard = card;
}


//ELEGIR UNA CARTA DE COLOR
document.getElementById('colorCardRed').addEventListener('click', () => {playColorCard('r')});
document.getElementById('colorCardGreen').addEventListener('click', () => {playColorCard('g')});
document.getElementById('colorCardBlue').addEventListener('click', () => {playColorCard('b')});
document.getElementById('colorCardYellow').addEventListener('click', () => {playColorCard('y')});

async function playColorCard(color)
{
	await closeColorWindow();

	if(!canPlay) return;
	
	const cardColors =
	{
		r: 'COLORr',
		g: 'COLORg',
		b: 'COLORb',
		y: 'COLORy'
	}

	const card = cardColors[color];
	if(!card)
	{
		floatingWindow(
		{
			title: 'Algo salió mal',
			text: `${color} no es una carta de color válida`,
			button:
			{
				text: 'Aceptar',
				callback: closeWindow
			}
		});
		return;
	}

	ws.send(JSON.stringify(
	{
		operation: 'play',
		roomID,
		username,
		play:
		{
			card: 'COLOR',
			color: card
		}
	}));
}
